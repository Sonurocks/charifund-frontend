"use client";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import React, { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";




import { CreatePaymentOrderResponse, createPaymentOrder, verifyPaymentOrder, fetchDonationReceipt, CreatePaymentOrderPayload } from "@/src/services/web/client/clientServices";
import { RootState } from "@/src/store";
import { loadRazorpayScript } from "@/src/utils/razorpay";
import { DetailsFormValues, DetailsformSchema } from "@/src/utils/validations/FormValidation";
import { useSelector } from "react-redux";
import Button from "../../UI/web/Buttons/Button";
import InputField from "../../UI/web/InputField";
import ThankYouModal from "./ThankYouModal";
import { DonationReceipt } from "@/src/types/web/receipt";
const Formik = lazy(() => import("formik").then((m) => ({ default: m.Formik }))) as typeof import("formik").Formik;
const Form = lazy(() => import("formik").then((m) => ({ default: m.Form }))) as typeof import("formik").Form;
const initialValues: DetailsFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    message: "",
};
const DetailsForm = ({ campaignId, campaignTitle }: { campaignId?: string; campaignTitle?: string }) => {
    const { t } = useTranslation();
    const { method, amount } = useSelector((state: RootState) => state.donation);
    const [paymentStep, setPaymentStep] = React.useState<"idle" | "details" | "creating" | "verifying">("idle");
    const [verifiedReceipt, setVerifiedReceipt] = React.useState<DonationReceipt | null>(null);
    const isVerifyingRef = React.useRef(false);
    
    const createOrderMutation = useMutation<CreatePaymentOrderResponse, AxiosError<{ message: string }>, CreatePaymentOrderPayload>({
        mutationFn: createPaymentOrder,
        onError: async (error: any) => {
            const toastModule = await import("react-hot-toast");
            toastModule.default.error(error?.response?.data?.msg || error?.response?.data?.message);
            setPaymentStep("idle");
        }
    });

    const verifyMutation = useMutation<any, AxiosError<{ message: string }>, { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }>({
        mutationFn: verifyPaymentOrder,
    });

    const handleSubmit = async (
        values: DetailsFormValues,
        { resetForm }: { resetForm: () => void }
    ) => {
        if (paymentStep !== "idle") return; // Prevent duplicate payments
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            const toastModule = await import("react-hot-toast");
            toastModule.default.error(t("Please enter a valid donation amount."));
            return;
        }

        setPaymentStep("creating");

        const orderPayload: CreatePaymentOrderPayload = {
            amount: parsedAmount,
            paymentMethod: method as "online" | "offline",
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone: values.phone,
            address: values.address,
            message: values.message,
        };

        if (campaignId) {
            orderPayload.campaignId = campaignId;
            orderPayload.campaignTitle = campaignTitle || "";
        }

        // Offline donation flow
        if (method === "offline") {
            try {
                const response = await createOrderMutation.mutateAsync(orderPayload);
                const toastModule = await import("react-hot-toast");
                toastModule.default.success(response?.msg || response?.message || t("Donation details submitted successfully."));
                resetForm();
            } catch (error) {
                console.error("Offline Donated Failed:", error);
            } finally {
                setPaymentStep("idle");
            }
            return;
        }

        // 3. Online Razorpay flow
        setPaymentStep("creating");
        
        // Load razorpay script
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
            const toastModule = await import("react-hot-toast");
            toastModule.default.error(t("Razorpay SDK failed to load. Check your connection."));
            setPaymentStep("idle");
            return;
        }

        try {
            let razorpayOrderId = "";
            let backendAmount = 0;
            let backendKey = "";
            try {
                const orderData = await createOrderMutation.mutateAsync(orderPayload);
                
                razorpayOrderId = orderData?.orderId || "";
                backendAmount = orderData?.amount || 0; // Prioritize Backend verification of amount
                backendKey = orderData?.key || "";
                
                if (!razorpayOrderId) throw new Error("Order ID missing from backend response.");
            } catch (backendError) {
                console.error("Payment Order Creation Failed:", backendError);
                setPaymentStep("idle");
                return; // Stop the flow
            }

            const rzpKey = backendKey || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
            if (!rzpKey) {
                console.error("Critical Error: NEXT_PUBLIC_RAZORPAY_KEY_ID is missing.");
                const toastModule = await import("react-hot-toast");
                toastModule.default.error(t("Payment gateway is temporarily unavailable. Please contact support."));
                setPaymentStep("idle");
                return;
            }

            const options = {
                key: rzpKey,
                amount: backendAmount, // Trusted backend amount
                currency: "INR",
                name: "Charifund",
                description: t("Donation for Charifund"),
                order_id: razorpayOrderId,
                handler: async function (response: Record<string, string>) {
                    if (isVerifyingRef.current) return;
                    isVerifyingRef.current = true;
                    setPaymentStep("verifying");
                    try {
                        const verified = await verifyMutation.mutateAsync({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        const toastModule = await import("react-hot-toast");
                        toastModule.default.success(verified?.msg || verified?.message || t("Payment Verification Success"));
                        resetForm();

                        // Extract receipt payload from verified response if present
                        let receiptPayload = verified?.receipt || verified?.data?.receipt || verified?.data;

                        // If receipt payload is missing from verification response, retrieve via receipt endpoint
                        if (!receiptPayload?.receiptNumber && !receiptPayload?.id) {
                            const identifier = response.razorpay_payment_id || response.razorpay_order_id;
                            if (identifier) {
                                try {
                                    const fetched = await fetchDonationReceipt(identifier);
                                    if (fetched?.receipt) {
                                        receiptPayload = fetched.receipt;
                                    } else if (fetched?.data) {
                                        receiptPayload = fetched.data;
                                    }
                                } catch (fetchErr) {
                                    console.warn("Could not retrieve receipt via dedicated endpoint, using verified response:", fetchErr);
                                }
                            }
                        }

                        const donationAmount = receiptPayload?.amount || (backendAmount ? backendAmount / 100 : parsedAmount);

                        const receiptObj: DonationReceipt = {
                            receiptNumber:
                                receiptPayload?.receiptNumber ||
                                receiptPayload?.receiptNo ||
                                `RCP-${response.razorpay_payment_id.slice(-8).toUpperCase()}`,
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            paymentMethod: receiptPayload?.paymentMethod || "Online (Razorpay)",
                            paymentStatus: receiptPayload?.paymentStatus || "Completed",
                            paymentDate: receiptPayload?.createdAt || receiptPayload?.date || new Date().toISOString(),
                            amount: donationAmount,
                            amountInWords: receiptPayload?.amountInWords,
                            campaignTitle: receiptPayload?.campaignTitle || campaignTitle || "General Welfare Fund",
                            campaignId: receiptPayload?.campaignId || campaignId,
                            donor: {
                                name: receiptPayload?.donor?.name || `${values.firstName} ${values.lastName}`.trim(),
                                email: receiptPayload?.donor?.email || values.email,
                                phone: receiptPayload?.donor?.phone || values.phone,
                                address: receiptPayload?.donor?.address || values.address,
                                pan: receiptPayload?.donor?.pan,
                            },
                            organization: receiptPayload?.organization,
                            taxNote: receiptPayload?.taxNote,
                            isVerified: true,
                        };

                        setVerifiedReceipt(receiptObj);
                    } catch (e: any) {
                        const toastModule = await import("react-hot-toast");
                        toastModule.default.error(e?.response?.data?.msg || e?.response?.data?.message || t("Payment Verification Failed"));
                    } finally {
                        isVerifyingRef.current = false;
                        setPaymentStep("idle");
                    }
                },
                prefill: {
                    name: `${values.firstName} ${values.lastName}`,
                    email: values.email,
                    contact: values.phone
                },
                theme: { color: "#3399cc" },
                modal: {
                    ondismiss: function () {
                        // Resets button state if user closes modal or Razorpay fails to load
                        setPaymentStep("idle");
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            
            rzp.on("payment.failed", async function (response: any) {
                const toastModule = await import("react-hot-toast");
                const errorMsg = response?.error?.description || response?.error?.message || t("Payment Failed. Your payment could not be completed.");
                toastModule.default.error(errorMsg);
                setPaymentStep("idle");
            });

            rzp.open();
        } catch (error) {
            setPaymentStep("idle");
        }
    };
    return (
        <div className="w-full mx-auto bg-white">
            <h2 className="text-2xl font-bold mb-6">{t("Details Information")}</h2>
                <Suspense fallback={<div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="w-full rounded-md border-2 border-gray-200/40 h-[50px] animate-pulse"/>
                    <div className="w-full rounded-md border-2 border-gray-200/40 h-[50px] animate-pulse"/>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="w-full rounded-md border-2 border-gray-200/40 h-[50px] animate-pulse"/>
                    <div className="w-full rounded-md border-2 border-gray-200/40 h-[50px] animate-pulse"/>
                  </div>
                  <div className="w-full rounded-md border-2 border-gray-200/40 h-[50px] animate-pulse"/>
                  <div className="w-full rounded-md border-2 border-gray-200/40 h-[150px] animate-pulse"/>
                  <div className="w-28 h-10 bg-gray-200 rounded animate-pulse"/>
                </div>}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={DetailsformSchema}
                    onSubmit={handleSubmit}
                >
                {({ isSubmitting }) => (
                    <Form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField name="firstName" placeholder={t("First Name")} icon="mdi:account" />
                            <InputField name="lastName" placeholder={t("Last Name")} icon="mdi:account" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField name="email" placeholder={t("Your Email")} icon="mdi:email" />
                            <InputField name="phone" placeholder={t("Your Number")} icon="mdi:phone" />
                        </div>
                        <InputField name="address" placeholder={t("Your Address")} icon="mdi:map-marker" />
                        <InputField
                            name="message"
                            placeholder={t("Your message...")}
                            icon="mdi:email-outline"
                            as="textarea"
                        />
                        <Button
                            type="submit"
                            disabled={paymentStep !== "idle"}
                            hoverBg="before:bg-foreground"
                        >
                            {paymentStep === "details"
                              ? t("Saving Details...") 
                              : paymentStep === "creating"
                              ? t("Creating Order...")
                              : paymentStep === "verifying"
                              ? t("Verifying Payment...")
                              : t("Donate Now")}
                        </Button>
                    </Form>
                )}
            </Formik>
            </Suspense>
            
            <ThankYouModal 
                isOpen={!!verifiedReceipt} 
                onClose={() => setVerifiedReceipt(null)}
                onResetDonation={() => {
                    setVerifiedReceipt(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                receipt={verifiedReceipt}
            />
        </div>
    );
};
export default DetailsForm; 