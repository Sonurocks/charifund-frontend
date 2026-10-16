"use client";

import React, { useState } from "react";
import Modal from "@/src/components/UI/web/Modal";
import DatePicker from "@/src/components/UI/admin/DatePicker";
import Dropdown from "@/src/components/UI/admin/Dropdown";
import CustomInput from "@/src/components/UI/admin/CustomInput";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UnifiedDonation, VerifyOfflineDonationPayload } from "@/src/types/admin/donation";
import { verifyOfflineDonation } from "@/src/services/admin/donationApi";
import ButtonLoader from "@/src/components/UI/web/Loader/ButtonLoader";
import { getApiErrorMessage } from "@/src/utils/apiHelpers";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaShieldAlt,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";

interface VerifyOfflineModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation: UnifiedDonation | null;
  onSuccess?: () => void;
  currentLang?: string;
}

export const VerifyOfflineModal: React.FC<VerifyOfflineModalProps> = ({
  isOpen,
  onClose,
  donation,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Wizard step: "edit" or "review"
  const [step, setStep] = useState<"edit" | "review">("edit");

  // Form state
  const pledgedAmount = Number(donation?.amount || 0);
  const [receivedAmount, setReceivedAmount] = useState<number>(pledgedAmount);
  const [paymentSubMethod, setPaymentSubMethod] = useState<string>("cash");
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [receivedDate, setReceivedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const paymentModeOptions = [
    { label: t("Cash Payment") || "Cash Payment", value: "cash" },
    { label: t("Cheque") || "Cheque", value: "cheque" },
    { label: t("Bank Transfer / NEFT / IMPS") || "Bank Transfer / NEFT / IMPS", value: "bank_transfer" },
    { label: t("Demand Draft (DD)") || "Demand Draft (DD)", value: "dd" },
    { label: t("Other Offline") || "Other Offline", value: "other" },
  ];

  // Sync state when donation changes
  React.useEffect(() => {
    if (donation) {
      setReceivedAmount(Number(donation.amount || 0));
      setPaymentSubMethod(donation.paymentSubMethod || "cash");
      setReferenceNumber(donation.referenceNumber || "");
      setReceivedDate(new Date().toISOString().split("T")[0]);
      setNotes("");
      setErrorMsg(null);
      setStep("edit");
    }
  }, [donation]);

  const statusLower = (donation?.status || "").toLowerCase();
  const isAlreadyConfirmed =
    statusLower === "completed" ||
    statusLower === "success" ||
    statusLower === "paid" ||
    statusLower === "verified";

  const verifyMutation = useMutation({
    mutationFn: async (payload: VerifyOfflineDonationPayload) => {
      if (!donation?.id) throw new Error("Donation ID is missing.");
      return await verifyOfflineDonation(donation.id, payload);
    },
    onSuccess: (data) => {
      toast.success(
        data?.message || t("Offline donation verified and confirmed successfully!")
      );
      // Invalidate relevant caches to refresh admin table, dashboard totals, and campaign metrics
      queryClient.invalidateQueries({ queryKey: ["unified-donations"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
      queryClient.invalidateQueries({ queryKey: ["campaign-distribution"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-funds"] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaign-donors"] });
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (err: any) => {
      const msg = getApiErrorMessage(err, t("Failed to verify offline donation."));
      setErrorMsg(msg);
      toast.error(msg);
    },
  });

  if (!donation) return null;

  const donorName =
    donation.name?.trim() ||
    `${donation.firstName || ""} ${donation.lastName || ""}`.trim() ||
    donation.donorName ||
    "Supporter";

  const isAmountDifferent = receivedAmount !== pledgedAmount;
  const amountDifference = receivedAmount - pledgedAmount;

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isAlreadyConfirmed) {
      setErrorMsg(t("This donation has already been verified and confirmed."));
      return;
    }

    const sanitizedAmount = Math.round(Number(receivedAmount) * 100) / 100;
    if (isNaN(sanitizedAmount) || sanitizedAmount <= 0) {
      setErrorMsg(t("Please enter a valid received amount greater than 0."));
      return;
    }

    if (sanitizedAmount > 100000000) {
      setErrorMsg(t("Received amount exceeds allowable limit."));
      return;
    }

    if (!receivedDate || !receivedDate.trim()) {
      setErrorMsg(t("Payment received date is required."));
      return;
    }

    const selectedDate = new Date(receivedDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (selectedDate.getTime() > today.getTime()) {
      setErrorMsg(t("Payment received date cannot be in the future."));
      return;
    }

    if (isAmountDifferent && !notes.trim()) {
      setErrorMsg(
        t(
          "Received amount differs from pledged amount. Please provide an explanatory note."
        )
      );
      return;
    }

    setStep("review");
  };

  const handleFinalSubmit = () => {
    if (verifyMutation.isPending || isAlreadyConfirmed) return;
    setErrorMsg(null);
    const sanitizedAmount = Math.round(Number(receivedAmount) * 100) / 100;
    verifyMutation.mutate({
      receivedAmount: sanitizedAmount,
      amount: sanitizedAmount,
      receivedDate,
      referenceNumber: referenceNumber.trim() || undefined,
      paymentSubMethod,
      notes: notes.trim() || undefined,
    });
  };

  const modalTitle =
    step === "edit"
      ? t("Verify Offline Donation") || "Verify Offline Donation"
      : t("Confirm Financial Verification") || "Confirm Financial Verification";

  const modalDescription =
    step === "edit"
      ? t("Record received payment into authoritative ledger") || "Record received payment into authoritative ledger"
      : t("Review and authorize official entry into collections") || "Review and authorize official entry into collections";

  const footerContent =
    step === "edit" ? (
      <div className="flex items-center justify-end gap-3 w-full">

        <button
          type="submit"
          form="verify-form"
          disabled={isAlreadyConfirmed}
          className="px-5 py-2 bg-[#00715D] hover:bg-[#005a4a] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{isAlreadyConfirmed ? t("Already Verified") : t("Review & Confirm")}</span>
          <FaArrowRight className="text-xs" />
        </button>
      </div>
    ) : (
      <div className="flex items-center justify-between gap-3 w-full">
        <button
          type="button"
          onClick={() => setStep("edit")}
          disabled={verifyMutation.isPending}
          className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <FaArrowLeft className="text-xs" />
          <span>{t("Back to Edit")}</span>
        </button>

        <button
          type="button"
          onClick={handleFinalSubmit}
          disabled={verifyMutation.isPending || isAlreadyConfirmed}
          className="px-5 py-2 bg-[#00715D] hover:bg-[#005a4a] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {verifyMutation.isPending ? (
            <>
              <ButtonLoader />
              <span>{t("Confirming Payment...")}</span>
            </>
          ) : (
            <>
              <FaCheckCircle className="text-xs" />
              <span>{t("Confirm & Record Payment")}</span>
            </>
          )}
        </button>
      </div>
    );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      showCloseButton={true}
      title={modalTitle}
      description={modalDescription}
      headerIcon={
        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
          <FaShieldAlt className="text-base" />
        </div>
      }
      footer={footerContent}
    >
      <div className="space-y-4 text-xs sm:text-sm text-gray-800">
        {isAlreadyConfirmed && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
            <FaCheckCircle className="text-emerald-600 shrink-0" />
            <span className="font-semibold">
              {t("This donation has already been verified and recorded in authoritative collections.")}
            </span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] rounded-lg text-xs flex items-start gap-2">
            <FaExclamationTriangle className="text-[#dc2626] shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Donation Summary Overview */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 space-y-2">
          <div className="flex justify-between items-start gap-2 border-b border-gray-200 pb-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">
                {t("Donor")}
              </span>
              <p className="font-bold text-gray-900 text-sm">{donorName}</p>
              <p className="text-[11px] text-gray-600 font-medium">{donation.phone || donation.email || "—"}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">
                {t("Pledged Amount")}
              </span>
              <p className="text-base font-black text-gray-900">
                ₹{pledgedAmount.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center text-[11px] text-gray-600 pt-0.5">
            <span>
              {t("Ref ID")}: <span className="font-mono font-bold text-gray-900">{donation.id}</span>
            </span>
            <span className={`font-bold ${isAlreadyConfirmed ? "text-emerald-700" : "text-amber-600"}`}>
              {isAlreadyConfirmed ? t("Paid") : t("Offline")}
            </span>
          </div>
        </div>

        {step === "edit" ? (
          <form id="verify-form" onSubmit={handleProceedToReview} className="space-y-3.5">
            {/* Actually Received Amount with CustomInput */}
            <div>
              <CustomInput
                label={`${t("Actually Received Amount (₹)")}*`}
                name="receivedAmount"
                type="number"
                placeholder="Enter received amount"
                value={receivedAmount}
                onChange={(e) => setReceivedAmount(parseFloat(e.target.value) || 0)}
                icon="mdi:currency-inr"
              />

              {isAmountDifferent && (
                <div className="mt-2 p-2 bg-[#fef3c7] border border-[#fcd34d] rounded-md text-[11px] text-[#92400e] flex items-center gap-1.5 font-medium">
                  <FaExclamationTriangle className="text-[#b45309] shrink-0" />
                  <span>
                    {amountDifference > 0
                      ? t(`Received amount is ₹${Math.abs(amountDifference).toLocaleString("en-IN")} MORE than pledged.`)
                      : t(`Received amount is ₹${Math.abs(amountDifference).toLocaleString("en-IN")} LESS than pledged.`)}
                  </span>
                </div>
              )}
            </div>

            {/* Payment Mode (Reusable Dropdown) & Reference (CustomInput) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
              <div>
                <Dropdown
                  label={`${t("Payment Mode")}*`}
                  required
                  options={paymentModeOptions}
                  value={paymentSubMethod}
                  onChange={(val) => setPaymentSubMethod(String(val))}
                  placeholder="Select payment mode"
                />
              </div>

              <div>
                <CustomInput
                  label={t("Cheque / Reference No.") || "Cheque / Reference No."}
                  name="referenceNumber"
                  type="text"
                  placeholder="e.g. CHQ-98124 or UTR#..."
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  icon="mdi:card-bulleted-outline"
                />
              </div>
            </div>

            {/* Received Date with Reusable DatePicker */}
            <div>
              <DatePicker
                label={t("Payment Received Date") || "Payment Received Date"}
                required
                value={receivedDate}
                onChange={(val) => setReceivedDate(val)}
                maxDate={new Date()}
                inModal={true}
                placeholder="Select received date"
              />
            </div>

            {/* Notes / Reason with CustomInput as textarea */}
            <div>
              <CustomInput
                label={`${t("Verification Notes")}${isAmountDifferent ? "* (Required)" : ""}`}
                as="textarea"
                name="notes"
                placeholder={
                  isAmountDifferent
                    ? t("Mandatory explanation for difference between pledged and received amount...") || "Mandatory explanation for difference..."
                    : t("Optional notes or receipt notes...") || "Optional notes..."
                }
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </form>
        ) : (
          /* Review Confirmation Step */
          <div className="space-y-4">
            <div className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-[#065f46] uppercase tracking-wider flex items-center gap-1.5">
                <FaCheckCircle className="text-[#059669]" />
                {t("Review Verification Details Before Confirming")}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1">
                <div>
                  <span className="text-gray-600 block">{t("Donor")}:</span>
                  <span className="font-bold text-gray-900">{donorName}</span>
                </div>

                <div>
                  <span className="text-gray-600 block">{t("Amount to Confirm")}:</span>
                  <span className="text-base font-black text-[#047857]">
                    ₹{Number(receivedAmount).toLocaleString("en-IN")}
                  </span>
                </div>

                <div>
                  <span className="text-gray-600 block">{t("Payment Mode")}:</span>
                  <span className="font-bold text-gray-900 uppercase">
                    {paymentSubMethod}
                  </span>
                </div>

                <div>
                  <span className="text-gray-600 block">{t("Received Date")}:</span>
                  <span className="font-bold text-gray-900">{receivedDate}</span>
                </div>

                {referenceNumber && (
                  <div className="col-span-1 sm:col-span-2">
                    <span className="text-gray-600 block">{t("Reference / Cheque")}:</span>
                    <span className="font-mono text-gray-900 font-bold">{referenceNumber}</span>
                  </div>
                )}

                {notes && (
                  <div className="col-span-1 sm:col-span-2">
                    <span className="text-gray-600 block">{t("Verification Notes")}:</span>
                    <span className="text-gray-800 italic font-medium">{notes}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-[#fef3c7] border border-[#fcd34d] rounded-lg text-xs text-[#92400e] leading-relaxed font-medium">
              <strong className="block mb-1 font-bold text-[#78350f]">{t("Financial Notice")}:</strong>
              {t(
                "Confirming this payment will officially mark this pledge as received and verified. The verified amount will be included in the organization's authoritative collections, and an official 80G tax receipt will become available for generation."
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default VerifyOfflineModal;
