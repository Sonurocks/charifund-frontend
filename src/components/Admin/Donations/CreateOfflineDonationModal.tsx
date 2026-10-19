"use client";

import React from "react";
import Modal from "@/src/components/UI/web/Modal";
import DatePicker from "@/src/components/UI/admin/DatePicker";
import Dropdown from "@/src/components/UI/admin/Dropdown";
import CustomInput from "@/src/components/UI/admin/CustomInput";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { createOfflineDonation } from "@/src/services/admin/donationApi";
import { Campaign } from "@/src/types/admin/campaign";
import ButtonLoader from "@/src/components/UI/web/Loader/ButtonLoader";
import { FaPlusCircle } from "react-icons/fa";
import { getApiErrorMessage } from "@/src/utils/apiHelpers";

interface CreateOfflineDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaigns?: Campaign[];
  currentLang?: string;
}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  pan: string;
  amount: number | "";
  type: "general" | "campaign";
  campaignId: string;
  paymentSubMethod: "cash" | "cheque" | "bank_transfer" | "dd" | "other";
  referenceNumber: string;
  receivedDate: string;
  notes: string;
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string().trim().required("First name is required"),
  lastName: Yup.string().trim().required("Last name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  phone: Yup.string()
    .trim()
    .matches(/^[0-9+\s-]{8,16}$/, "Enter a valid phone number (min 8 digits)")
    .required("Phone number is required"),
  address: Yup.string().trim(),
  pan: Yup.string()
    .trim()
    .required("PAN number is required")
    .test(
      "valid-pan",
      "Please enter a valid 10-character PAN (e.g. ABCDE1234F)",
      (val) => !!val && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(val)
    ),
  amount: Yup.number()
    .typeError("Amount must be a number")
    .positive("Amount must be greater than 0")
    .max(100000000, "Amount exceeds allowable limit (₹10,00,00,000)")
    .test(
      "maxDecimals",
      "Amount cannot have more than 2 decimal places",
      (val) => val === undefined || val === null || /^\d+(\.\d{1,2})?$/.test(String(val))
    )
    .required("Donation amount is required"),
  type: Yup.string().oneOf(["general", "campaign"]).required("Select donation category"),
  campaignId: Yup.string().when("type", {
    is: "campaign",
    then: (schema) => schema.required("Please select a campaign"),
    otherwise: (schema) => schema.notRequired(),
  }),
  paymentSubMethod: Yup.string().required("Select payment mode"),
  referenceNumber: Yup.string().trim(),
  receivedDate: Yup.string()
    .required("Received date is required")
    .test("not-future", "Payment received date cannot be in the future", (val) => {
      if (!val) return false;
      const d = new Date(val);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return d.getTime() <= today.getTime();
    }),
  notes: Yup.string().trim(),
});

export const CreateOfflineDonationModal: React.FC<CreateOfflineDonationModalProps> = ({
  isOpen,
  onClose,
  campaigns = [],
  currentLang = "en",
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const initialValues: FormValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    pan: "",
    amount: "",
    type: "general",
    campaignId: "",
    paymentSubMethod: "cash",
    referenceNumber: "",
    receivedDate: new Date().toISOString().split("T")[0],
    notes: "",
  };

  const paymentModeOptions = [
    { label: t("Cash Payment") || "Cash Payment", value: "cash" },
    { label: t("Cheque") || "Cheque", value: "cheque" },
    { label: t("Bank Transfer / NEFT / IMPS") || "Bank Transfer / NEFT / IMPS", value: "bank_transfer" },
    { label: t("Demand Draft (DD)") || "Demand Draft (DD)", value: "dd" },
    { label: t("Other Offline") || "Other Offline", value: "other" },
  ];

  const campaignOptions = [
    { label: t("-- Select a Campaign --") || "-- Select a Campaign --", value: "" },
    ...campaigns.map((camp) => {
      let title = `Campaign #${camp.id}`;
      if (camp.title) {
        if (typeof camp.title === "object") {
          title =
            (camp.title as any)[currentLang] ||
            (camp.title as any).en ||
            title;
        } else {
          title = String(camp.title);
        }
      }
      return {
        label: title,
        value: String(camp.id),
      };
    }),
  ];

  const createMutation = useMutation({
    mutationFn: createOfflineDonation,
    onSuccess: (data) => {
      toast.success(
        data?.message || t("Offline donation recorded successfully in admin registry!")
      );
      // Invalidate relevant query caches to refresh donations, dashboard, and campaign progress
      queryClient.invalidateQueries({ queryKey: ["unified-donations"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
      queryClient.invalidateQueries({ queryKey: ["campaign-distribution"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-funds"] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaign-donors"] });
      onClose();
    },
    onError: (err: any) => {
      const msg = getApiErrorMessage(err, t("Failed to record offline donation."));
      toast.error(msg);
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        if (createMutation.isPending) return;

        const selectedCampaign = campaigns.find(
          (c) => String(c.id) === values.campaignId
        );
        let campaignTitle = "";
        if (selectedCampaign?.title) {
          if (typeof selectedCampaign.title === "object") {
            campaignTitle =
              (selectedCampaign.title as any)[currentLang] ||
              (selectedCampaign.title as any).en ||
              "";
          } else {
            campaignTitle = String(selectedCampaign.title);
          }
        }

        const sanitizedAmount = Math.round(Number(values.amount) * 100) / 100;

        createMutation.mutate(
          {
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            email: values.email.trim(),
            phone: values.phone.trim(),
            address: values.address.trim() || undefined,
            pan: values.pan.trim() ? values.pan.trim().toUpperCase() : undefined,
            amount: sanitizedAmount,
            type: values.type,
            campaignId: values.type === "campaign" ? values.campaignId : undefined,
            campaignTitle: values.type === "campaign" ? campaignTitle : undefined,
            paymentSubMethod: values.paymentSubMethod,
            referenceNumber: values.referenceNumber.trim() || undefined,
            receivedDate: values.receivedDate,
            notes: values.notes.trim() || undefined,
          },
          {
            onSuccess: () => {
              resetForm();
            },
          }
        );
      }}
    >
      {({ values, errors, touched, setFieldValue }) => (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size="lg"
          showCloseButton={true}
          title={t("Record Direct Offline Donation") || "Record Direct Offline Donation"}
          description={t("Log in-office, cash, cheque, or bank transfer contributions directly.") || "Log in-office, cash, cheque, or bank transfer contributions directly."}
          headerIcon={
            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <FaPlusCircle className="text-base" />
            </div>
          }
          footer={
            <div className="flex items-center justify-end gap-3 w-full">
              <button
                type="submit"
                form="create-offline-form"
                disabled={createMutation.isPending}
                className="px-5 py-2 bg-[#00715D] hover:bg-[#005a4a] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {createMutation.isPending ? (
                  <>
                    <ButtonLoader />
                    <span>{t("Recording Donation...")}</span>
                  </>
                ) : (
                  <>
                    <FaPlusCircle className="text-xs" />
                    <span>{t("Record Donation")}</span>
                  </>
                )}
              </button>
            </div>
          }
        >
          <Form id="create-offline-form" className="space-y-4 text-xs sm:text-sm text-gray-800">
            {/* Category Selector Tabs */}
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1.5">
                {t("Donation Category")} <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setFieldValue("type", "general");
                    setFieldValue("campaignId", "");
                  }}
                  className={`py-2 text-xs font-bold rounded-md transition-all cursor-pointer text-center ${
                    values.type === "general"
                      ? "bg-white text-gray-900 shadow-xs border border-gray-200"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {t("General Donation")}
                </button>
                <button
                  type="button"
                  onClick={() => setFieldValue("type", "campaign")}
                  className={`py-2 text-xs font-bold rounded-md transition-all cursor-pointer text-center ${
                    values.type === "campaign"
                      ? "bg-white text-gray-900 shadow-xs border border-gray-200"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {t("Campaign Donation")}
                </button>
              </div>
            </div>

            {/* Campaign Dropdown if type is campaign */}
            {values.type === "campaign" && (
              <div>
                <Dropdown
                  label={`${t("Select Campaign")}*`}
                  required
                  options={campaignOptions}
                  value={values.campaignId}
                  onChange={(val) => setFieldValue("campaignId", String(val))}
                  placeholder={t("-- Select a Campaign --") || "-- Select a Campaign --"}
                  searchable={campaigns.length > 5}
                  searchPlaceholder="Search campaign..."
                  error={touched.campaignId && errors.campaignId ? errors.campaignId : ""}
                />
              </div>
            )}

            {/* Donor Name Fields with CustomInput */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
              <div>
                <CustomInput
                  label={`${t("First Name")}*`}
                  name="firstName"
                  placeholder="John"
                  value={values.firstName}
                  onChange={(e) => setFieldValue("firstName", e.target.value)}
                  error={touched.firstName && errors.firstName ? errors.firstName : ""}
                  icon="mdi:account-outline"
                />
              </div>

              <div>
                <CustomInput
                  label={`${t("Last Name")}*`}
                  name="lastName"
                  placeholder="Doe"
                  value={values.lastName}
                  onChange={(e) => setFieldValue("lastName", e.target.value)}
                  error={touched.lastName && errors.lastName ? errors.lastName : ""}
                  icon="mdi:account-outline"
                />
              </div>
            </div>

            {/* Contact Fields with CustomInput */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
              <div>
                <CustomInput
                  label={`${t("Email Address")}*`}
                  name="email"
                  type="email"
                  placeholder="donor@example.com"
                  value={values.email}
                  onChange={(e) => setFieldValue("email", e.target.value)}
                  error={touched.email && errors.email ? errors.email : ""}
                  icon="mdi:email-outline"
                />
              </div>

              <div>
                <CustomInput
                  label={`${t("Phone Number")}*`}
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={values.phone}
                  onChange={(e) => setFieldValue("phone", e.target.value)}
                  error={touched.phone && errors.phone ? errors.phone : ""}
                  icon="mdi:phone-outline"
                />
              </div>
            </div>

            {/* Address & Optional PAN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
              <div>
                <CustomInput
                  label={`${t("Address")} (${t("Optional")})`}
                  name="address"
                  placeholder="City, State, Postal Code"
                  value={values.address}
                  onChange={(e) => setFieldValue("address", e.target.value)}
                  icon="mdi:map-marker-outline"
                />
              </div>
              <div>
                <CustomInput
                  label={`${t("PAN Number")}*`}
                  name="pan"
                  placeholder="e.g. ABCDE1234F"
                  value={values.pan}
                  onChange={(e) => setFieldValue("pan", e.target.value.toUpperCase())}
                  error={touched.pan && errors.pan ? errors.pan : ""}
                  icon="mdi:card-account-details-outline"
                />
              </div>
            </div>

            {/* Amount & Mode with CustomInput and Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start pt-1">
              <div>
                <CustomInput
                  label={`${t("Donation Amount (₹)")}*`}
                  name="amount"
                  type="number"
                  placeholder="5000"
                  value={values.amount}
                  onChange={(e) => setFieldValue("amount", e.target.value)}
                  error={touched.amount && errors.amount ? errors.amount : ""}
                  icon="mdi:currency-inr"
                />
              </div>

              <div>
                <Dropdown
                  label={`${t("Payment Mode")}*`}
                  required
                  options={paymentModeOptions}
                  value={values.paymentSubMethod}
                  onChange={(val) => setFieldValue("paymentSubMethod", String(val))}
                  placeholder="Select payment mode"
                />
              </div>
            </div>

            {/* Reference & Date with CustomInput and DatePicker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
              <div>
                <CustomInput
                  label={`${t("Cheque / Transaction Ref")} (${t("Optional")})`}
                  name="referenceNumber"
                  placeholder="e.g. CHQ-10492 or UTR#..."
                  value={values.referenceNumber}
                  onChange={(e) => setFieldValue("referenceNumber", e.target.value)}
                  icon="mdi:card-bulleted-outline"
                />
              </div>

              <div>
                <DatePicker
                  label={t("Received Date") || "Received Date"}
                  required
                  value={values.receivedDate}
                  onChange={(val) => setFieldValue("receivedDate", val)}
                  maxDate={new Date()}
                  inModal={true}
                  error={touched.receivedDate && errors.receivedDate ? errors.receivedDate : undefined}
                />
              </div>
            </div>

            {/* Notes with CustomInput as textarea */}
            <div>
              <CustomInput
                label={`${t("Notes / Internal Memo")} (${t("Optional")})`}
                as="textarea"
                name="notes"
                placeholder="Notes regarding cash handover, verified campaign, or donor request..."
                value={values.notes}
                onChange={(e) => setFieldValue("notes", e.target.value)}
              />
            </div>
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default CreateOfflineDonationModal;
