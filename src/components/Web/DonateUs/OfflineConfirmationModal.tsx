"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  HeartHandshake,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { DonationProgressStepper } from "../../UI/DonationStatusBadge";
import Modal from "../../UI/web/Modal";
import { OfflinePledgeData } from "@/src/types/admin/donation";

interface OfflineConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  pledgeData: OfflinePledgeData | null;
}

export default function OfflineConfirmationModal({
  isOpen,
  onClose,
  pledgeData,
}: OfflineConfirmationModalProps) {
  const { t } = useTranslation();
  const [hasCopied, setHasCopied] = useState(false);

  if (!pledgeData) return null;

  const handleCopyId = async () => {
    if (!pledgeData?.donationId) {
      toast.error(t("Reference ID is not available to copy."));
      return;
    }
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(pledgeData.donationId);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = pledgeData.donationId;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setHasCopied(true);
      toast.success(t("Reference ID copied to clipboard!"));
      setTimeout(() => setHasCopied(false), 2500);
    } catch {
      toast.error(t("Failed to copy. Please manually copy the reference ID."));
    }
  };

  const formattedAmount = Number(pledgeData.amount || 0).toLocaleString("en-IN");
  const formattedDate = pledgeData.createdAt
    ? new Date(pledgeData.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

  const statusLower = (pledgeData.status || "").toLowerCase().trim();
  const isConfirmed =
    statusLower === "completed" ||
    statusLower === "success" ||
    statusLower === "paid" ||
    statusLower === "verified";
  const isFailed =
    statusLower === "failed" ||
    statusLower === "rejected" ||
    statusLower === "cancelled";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      showCloseButton={true}
      title={t("Offline Donation Acknowledgment")}
      footer={
        <div className="flex items-center justify-end w-full">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-primaryColor hover:brightness-95 text-foreground font-bold text-xs sm:text-sm rounded-lg shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>{t("Done")}</span>
          </button>
        </div>
      }
    >
      <div className="space-y-3.5 text-gray-800">
        {/* A. Compact Success Header */}
        <div className="flex items-start gap-3 p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
              {t("Your Donation Request Is Registered")}
            </h3>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
              {t(
                "Thank you for your pledge. Please complete the offline payment using the instructions below."
              )}
            </p>
          </div>
        </div>

        {/* B. Donation Summary Card */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 sm:p-4">
          {/* Top Row: Reference ID & Pledged Amount in one line (Label: Response) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-gray-200">
            <div className="min-w-0 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 shrink-0">
                {t("Donation Reference ID")}:
              </span>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-mono text-xs sm:text-sm font-bold text-gray-900 break-all select-all">
                  {pledgeData.donationId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-white hover:bg-gray-100 border border-gray-200 rounded text-xs text-gray-600 hover:text-gray-900 transition-colors cursor-pointer shrink-0"
                  title={hasCopied ? t("Copied!") : t("Copy Reference ID")}
                  aria-label={t("Copy Reference ID")}
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[11px] font-medium text-emerald-700">
                        {t("Copied")}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-medium">{t("Copy")}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center sm:justify-end gap-1.5 shrink-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 shrink-0">
                {t("Pledged Amount")}:
              </span>
              <span className="text-xl sm:text-2xl font-black text-gray-900 leading-none">
                ₹{formattedAmount}
              </span>
            </div>
          </div>

          {/* Symmetrical 2-Column Grid (Desktop) / 1-Column Grid (Mobile) - All fields in one line: Label: Response */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 pt-3 text-xs">
            {/* Donor Name */}
            <div className="min-w-0 flex items-center gap-1.5 py-0.5">
              <span className="text-gray-500 text-xs font-medium shrink-0">
                {t("Donor Name")}:
              </span>
              <span
                className="font-semibold text-gray-900 truncate"
                title={pledgeData.donorName || "Supporter"}
              >
                {pledgeData.donorName || "Supporter"}
              </span>
            </div>

            {/* Status */}
            <div className="min-w-0 flex items-center gap-1.5 py-0.5">
              <span className="text-gray-500 text-xs font-medium shrink-0">
                {t("Status")}:
              </span>
              <span
                className={`font-bold text-xs capitalize ${
                  isConfirmed
                    ? "text-emerald-700"
                    : isFailed
                    ? "text-rose-600"
                    : "text-amber-600"
                }`}
              >
                {isConfirmed ? t("Paid") : isFailed ? t("Failed") : t("Pending")}
              </span>
            </div>

            {/* Category / Campaign */}
            <div className="min-w-0 flex items-center gap-1.5 py-0.5">
              <span className="text-gray-500 text-xs font-medium shrink-0">
                {t("Category / Campaign")}:
              </span>
              <span
                className="font-semibold text-gray-900 truncate"
                title={pledgeData.campaignTitle || t("General Welfare Fund")}
              >
                {pledgeData.campaignTitle || t("General Welfare Fund")}
              </span>
            </div>

            {/* Date Pledged */}
            <div className="min-w-0 flex items-center gap-1.5 py-0.5">
              <span className="text-gray-500 text-xs font-medium shrink-0">
                {t("Date Pledged")}:
              </span>
              <span className="font-semibold text-gray-900 flex items-center gap-1 shrink-0">
                <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>{formattedDate}</span>
              </span>
            </div>

            {/* Contact Phone */}
            <div className="min-w-0 flex items-center gap-1.5 py-0.5">
              <span className="text-gray-500 text-xs font-medium shrink-0">
                {t("Contact Phone")}:
              </span>
              <span className="font-medium text-gray-800 truncate">
                {pledgeData.donorPhone || "—"}
              </span>
            </div>

            {/* Email Address */}
            <div className="min-w-0 flex items-center gap-1.5 py-0.5">
              <span className="text-gray-500 text-xs font-medium shrink-0">
                {t("Email Address")}:
              </span>
              <span
                className="font-medium text-gray-800 truncate"
                title={pledgeData.donorEmail || "—"}
              >
                {pledgeData.donorEmail || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Donation Progress Stepper */}
        <DonationProgressStepper
          status={pledgeData.status}
          paymentMethod={pledgeData.paymentMethod || "offline"}
        />

        {/* C. Short Financial Notice */}
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-lg p-2.5 sm:p-3 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t(
              "This is a pledge acknowledgment, not proof of payment or a final donation receipt. A donation receipt or applicable tax certificate will be available only after the payment is received and verified."
            )}
          </p>
        </div>

        {/* D. Simplified Next Steps */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <HeartHandshake className="w-3.5 h-3.5 text-green" />
            <span>{t("Next Steps")}</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200/80 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primaryColor/25 text-foreground font-bold text-[11px] flex items-center justify-center shrink-0">
                1
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-xs leading-snug">
                  {t("Save Reference ID")}
                </p>
                <p className="text-[11px] text-gray-600 leading-snug mt-0.5">
                  {t("Keep the reference for tracking your donation.")}
                </p>
              </div>
            </div>

            <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200/80 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primaryColor/25 text-foreground font-bold text-[11px] flex items-center justify-center shrink-0">
                2
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-xs leading-snug">
                  {t("Complete Payment")}
                </p>
                <p className="text-[11px] text-gray-600 leading-snug mt-0.5">
                  {t("Follow the verified bank/UPI instructions or contact the organization.")}
                </p>
              </div>
            </div>

            <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200/80 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primaryColor/25 text-foreground font-bold text-[11px] flex items-center justify-center shrink-0">
                3
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-xs leading-snug">
                  {t("Verification & Receipt")}
                </p>
                <p className="text-[11px] text-gray-600 leading-snug mt-0.5">
                  {t("The team verifies the payment and issues the appropriate receipt when eligible.")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* E. Simplified Organization & Contact Details */}
        <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-3 text-xs space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-gray-200">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 font-bold text-gray-900">
                <Building className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                <span className="leading-snug truncate">
                  Youth Util Welfare Association (YUWA INDIA)
                </span>
              </div>
              <span className="text-[10px] text-gray-500 pl-5 block">
                Reg: SOCIETY/WEST/ 2016/8902080
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-700 sm:text-right text-[11px] min-w-0">
              <a
                href="tel:+918565006669"
                className="inline-flex items-center gap-1 hover:text-green transition-colors break-all"
              >
                <Phone className="w-3 h-3 text-gray-500 shrink-0" />
                <span>+91 8565006669, 9450886855</span>
              </a>
              <a
                href="mailto:yuwaaindia@gmail.com"
                className="inline-flex items-center gap-1 hover:text-green transition-colors break-all"
              >
                <Mail className="w-3 h-3 text-gray-500 shrink-0" />
                <span>yuwaaindia@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Collapsible Office Addresses & Payment Instructions */}
          <details className="group">
            <summary className="flex items-center justify-between text-[11px] font-semibold text-gray-700 hover:text-gray-900 cursor-pointer select-none py-0.5">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                <span>{t("Office Addresses & Payment Instructions")}</span>
              </span>
              <span className="text-gray-400 group-open:rotate-180 transition-transform duration-200 text-xs">
                ▼
              </span>
            </summary>

            <div className="pt-2 border-t border-gray-200 mt-1.5 space-y-2 text-[11px] text-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="p-2 bg-white rounded border border-gray-200/70">
                  <strong className="text-gray-800 block mb-0.5 font-semibold">
                    {t("Head Office")}:
                  </strong>
                  <p className="leading-relaxed break-words">
                    H.No. RZC-13, Kh. No. 72/23, 78/3, Nihal Vihar, Nangloi, New Delhi-110041, India
                  </p>
                </div>
                <div className="p-2 bg-white rounded border border-gray-200/70">
                  <strong className="text-gray-800 block mb-0.5 font-semibold">
                    {t("Branch Office")}:
                  </strong>
                  <p className="leading-relaxed break-words">
                    Behind Sankat Mochan Hanuman Mandir, Azad Nagar Colony East, Taramandal Road, Rustampur, Gorakhpur, Uttar Pradesh-273016, India
                  </p>
                </div>
              </div>

              <div className="p-2 bg-white rounded border border-gray-200/70 text-gray-700 leading-relaxed">
                <strong className="text-gray-900 font-semibold">
                  {t("Accepted Offline Modes")}:{" "}
                </strong>
                {t(
                  "Submit cash or issue a Cheque / Demand Draft drawn in favor of 'Youth Util Welfare Association' at our office."
                )}
              </div>
            </div>
          </details>
        </div>
      </div>
    </Modal>
  );
}
