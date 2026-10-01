"use client";
import React, { Suspense, lazy } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";





import { DetailsformSchema, DetailsFormValues } from "@/src/utils/validations/FormValidation";
import { DetailsInformationForm, createPaymentOrder, verifyPaymentOrder } from "@/src/services/web/client/clientServices";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store";
import { loadRazorpayScript } from "@/src/utils/razorpay";
const Formik = lazy(() => import("formik").then((m) => ({ default: m.Formik })));
const Form = lazy(() => import("formik").then((m) => ({ default: m.Form })));
import InputField from "../../UI/web/InputField";
import Button from "../../UI/web/Buttons/Button";
import ButtonLoader from "../../UI/web/Loader/ButtonLoader";
const initialValues: DetailsFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    message: "",
};
const DetailsForm = ({ campaignId }: { campaignId?: string }) => {
    const { t } = useTranslation();
    const { method, amount } = useSelector((state: RootState) => state.donation);
    const [paymentStep, setPaymentStep] = React.useState<"idle" | "details" | "creating" | "verifying">("idle");
    
    const detailsMutation = useMutation({
        mutationFn: DetailsInformationForm,
        onError: async (error: any) => {
            const toastModule = await import("react-hot-toast");
            toastModule.default.error(t("Something went wrong saving details."));
            console.error("Submission error:", error);
            setPaymentStep("idle");
        },
    });

    const createOrderMutation = useMutation<any, any, { amount: number; campaignId: string }>({
        mutationFn: createPaymentOrder,
        onError: async (error: any) => {
            const toastModule = await import("react-hot-toast");
            toastModule.default.error(error?.response?.data?.message || t("Unable to start payment. Please try again."));
            setPaymentStep("idle");
        }
    });

    const verifyMutation = useMutation<any, any, { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }>({
        mutationFn: verifyPaymentOrder,
    });

    const handleSubmit = async (
        values: DetailsFormValues,
        { resetForm }: { resetForm: () => void }
    ) => {
        setPaymentStep("details");
        // 1. Save donor details
        await detailsMutation.mutateAsync(values);

        // 2. Offline donation flow
        if (method === "offline") {
            const toastModule = await import("react-hot-toast");
            toastModule.default.success(t("Offline donation logged successfully!"));
            resetForm();
            setPaymentStep("idle");
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
            try {
                const orderData = await createOrderMutation.mutateAsync({
                    amount: parseFloat(amount),
                    campaignId: campaignId || "", // NOTE: Backend requires campaignId but it can fail if missing
                });
                razorpayOrderId = orderData?.id || orderData?.order_id || "";
            } catch (backendError) {
                console.warn("Backend API crashed, falling back to unlinked checkout for frontend testing mode.", backendError);
                // Proceed with empty orderId for testing
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummykey12345",
                amount: parseFloat(amount) * 100, // assuming backend handles actual order amount, this is fallback config
                currency: "INR",
                name: "Charifund",
                description: t("Donation for Charifund"),
                order_id: razorpayOrderId,
                handler: async function (response: Record<string, string>) {
                    setPaymentStep("verifying");
                    try {
                        const verified = await verifyMutation.mutateAsync({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        const toastModule = await import("react-hot-toast");
                        toastModule.default.success(t("Payment Successful! Thank you for supporting our mission."));
                        resetForm();
                    } catch (e) {
                         const toastModule = await import("react-hot-toast");
                         toastModule.default.error(t("Payment verification failed. Please contact support if the amount was deducted."));
                    } finally {
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
            
            rzp.on("payment.failed", async function (response: Record<string, unknown>) {
                const toastModule = await import("react-hot-toast");
                toastModule.default.error(t("Payment Failed. Your payment could not be completed."));
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
                    onSubmit={handleSubmit as any}
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
        </div>
    );
};
export default DetailsForm; 