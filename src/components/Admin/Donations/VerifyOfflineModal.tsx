"use client";

import React, { useState, useEffect } from "react";
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
  FaInfoCircle,
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaBullhorn,
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

  // Form state
  const pledgedAmount = Number(donation?.amount || 0);
  const [receivedAmount, setReceivedAmount] = useState<number | string>(pledgedAmount);
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
  useEffect(() => {
    if (donation) {
      setReceivedAmount(Number(donation.amount || 0));
      setPaymentSubMethod(donation.paymentSubMethod || "cash");
      setReferenceNumber(donation.referenceNumber || "");
      setReceivedDate(new Date().toISOString().split("T")[0]);
      setNotes("");
      setErrorMsg(null);
    }
  }, [donation]);

  const statusLower = (donation?.status || "").toLowerCase().trim();
  const hasReceipt = Boolean(donation?.receiptNumber && String(donation.receiptNumber).trim());
  const isAlreadyConfirmed =
    statusLower === "completed" ||
    statusLower === "success" ||
    statusLower === "paid" ||
    statusLower === "verified" ||
    hasReceipt;

  const verifyMutation = useMutation({
    mutationFn: async (payload: VerifyOfflineDonationPayload) => {
      if (!donation?.id) throw new Error("Donation ID is missing.");
      return await verifyOfflineDonation(donation.id, payload);
    },
    onSuccess: (data) => {
      toast.success(
        data?.message || t("Offline donation verified and recorded successfully!")
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

  const numReceived = parseFloat(String(receivedAmount)) || 0;
  const isAmountDifferent = Math.abs(numReceived - pledgedAmount) > 0.01;
  const amountDifference = numReceived - pledgedAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isAlreadyConfirmed) {
      setErrorMsg(t("This donation has already been verified and confirmed."));
      return;
    }

    const sanitizedAmount = Math.round(Number(numReceived) * 100) / 100;
    if (isNaN(sanitizedAmount) || sanitizedAmount <= 0) {
      setErrorMsg(t("Please enter a valid received amount greater than 0."));
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

    verifyMutation.mutate({
      receivedAmount: sanitizedAmount,
      amount: sanitizedAmount,
      receivedDate,
      referenceNumber: referenceNumber.trim() || undefined,
      paymentSubMethod,
      notes: notes.trim() || undefined,
      message: notes.trim() || undefined,
    } as any);
  };

  const campaignTitle =
    typeof donation.campaignTitle === "object"
      ? (donation.campaignTitle as any)?.en || (donation.campaignTitle as any)?.hi || "Campaign"
      : donation.campaignTitle || donation.campaign?.name || "General Welfare Fund";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      showCloseButton={true}
      title={t("Verify Offline Donation")}
      description={t("Review donor pledge and record actual collected funds into official collections.")}
      headerIcon={
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
          <FaShieldAlt className="text-lg" />
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {t("Cancel")}
          </button>

          <button
            type="submit"
            form="verify-offline-form"
            disabled={verifyMutation.isPending || isAlreadyConfirmed}
            className="px-6 py-2.5 bg-[#00715D] hover:bg-[#005a4a] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {verifyMutation.isPending ? (
              <>
                <ButtonLoader />
                <span>{t("Verifying Payment...")}</span>
              </>
            ) : isAlreadyConfirmed ? (
              <>
                <FaCheckCircle className="text-sm" />
                <span>{t("Already Verified")}</span>
              </>
            ) : (
              <>
                <FaCheckCircle className="text-sm" />
                <span>
                  {t("Confirm & Record")} ₹{numReceived.toLocaleString("en-IN")}
                </span>
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-xs sm:text-sm text-gray-800">
        {isAlreadyConfirmed && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium">
            <FaCheckCircle className="text-emerald-600 shrink-0 text-sm" />
            <span>
              {t("This donation has already been verified and officially accounted for. Receipt is generated.")}
            </span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-start gap-2 font-medium">
            <FaExclamationTriangle className="text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 2-Column Responsive Layout: Left (Donor & Summary), Right (Verification Form) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {/* LEFT COLUMN: Donor Card & Live Comparison */}
          <div className="space-y-3">
            {/* Donor Information Neumorphic Card */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.04)] space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                  {t("Donor Profile")}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  isAlreadyConfirmed
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-800 border-amber-300"
                }`}>
                  {isAlreadyConfirmed ? t("Verified") : t("Unverified Pledge")}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <FaUser className="text-[#00715D] text-xs shrink-0" />
                  <span className="font-extrabold text-gray-900 text-sm">{donorName}</span>
                </div>

                {donation.phone && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaPhoneAlt className="text-gray-400 text-xs shrink-0" />
                    <span className="font-medium">{donation.phone}</span>
                  </div>
                )}

                {donation.email && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaEnvelope className="text-gray-400 text-xs shrink-0" />
                    <span className="font-medium truncate">{donation.email}</span>
                  </div>
                )}

                {donation.pan && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="font-bold text-[10px] text-gray-500 uppercase tracking-wider">PAN:</span>
                    <span className="font-mono font-bold text-gray-900 text-xs bg-gray-100 px-1.5 py-0.5 rounded">{donation.pan}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-gray-700 pt-1 border-t border-gray-100">
                  <FaBullhorn className="text-[#00715D] text-xs shrink-0" />
                  <span className="font-semibold text-gray-800 truncate" title={campaignTitle}>
                    {campaignTitle}
                  </span>
                </div>

                <div className="text-[11px] text-gray-500 font-mono pt-1">
                  {t("Ref ID")}: <span className="text-gray-900 font-bold select-all">{donation.id}</span>
                </div>
              </div>
            </div>

            {/* Amount Comparison Card (Flexible Amount Indicator) */}
            <div className="bg-gradient-to-br from-gray-50 to-emerald-50/40 rounded-2xl p-4 border border-gray-200/90 shadow-xs space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block">
                {t("Financial Amount Comparison")}
              </span>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 bg-white rounded-xl border border-gray-200/70">
                  <span className="text-[10px] text-gray-500 font-semibold block uppercase">
                    {t("Pledged Amount")}
                  </span>
                  <span className="text-base sm:text-lg font-black text-gray-700">
                    ₹{pledgedAmount.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-emerald-200 shadow-xs">
                  <span className="text-[10px] text-emerald-700 font-bold block uppercase">
                    {t("Actually Received")}
                  </span>
                  <span className="text-base sm:text-lg font-black text-[#00715D]">
                    ₹{numReceived.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {isAmountDifferent && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-300 rounded-xl text-[11px] text-amber-900 font-medium flex items-center gap-1.5">
                  <FaInfoCircle className="text-amber-700 shrink-0 text-xs" />
                  <span>
                    {amountDifference > 0
                      ? t(`Donor paid ₹${Math.abs(amountDifference).toLocaleString("en-IN")} MORE than initial pledge. Database will update to ₹${numReceived.toLocaleString("en-IN")}.`)
                      : t(`Donor paid ₹${Math.abs(amountDifference).toLocaleString("en-IN")} LESS than initial pledge. Database will update to ₹${numReceived.toLocaleString("en-IN")}.`)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Verification Input Form */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.04)]">
            <h5 className="text-xs font-black uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00715D]" />
              {t("Payment Verification Details")}
            </h5>

            <form id="verify-offline-form" onSubmit={handleSubmit} className="space-y-3">
              {/* Flexible Received Amount */}
              <div>
                <CustomInput
                  label={`${t("Actually Received Amount (₹)")}*`}
                  name="receivedAmount"
                  type="number"
                  placeholder="Enter amount collected"
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(e.target.value)}
                  icon="mdi:currency-inr"
                />
              </div>

              {/* Payment Mode & Reference Number in 2 columns */}
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

              {/* Payment Received Date */}
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

              {/* Notes / Internal Memo */}
              <div>
                <CustomInput
                  label={`${t("Verification Notes")} (${t("Optional")})`}
                  as="textarea"
                  name="notes"
                  placeholder={
                    isAmountDifferent
                      ? t("Explain reason for difference in pledged vs collected amount...")
                      : t("Cash handover memo, cheque deposit details, or notes...")
                  }
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default VerifyOfflineModal;
