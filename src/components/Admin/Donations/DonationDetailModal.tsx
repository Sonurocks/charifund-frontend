"use client";

import React from "react";
import Modal from "@/src/components/UI/web/Modal";
import { UnifiedDonation } from "@/src/types/admin/donation";
import { isDonationConfirmed } from "./donationColumns";
import { useTranslation } from "react-i18next";
import DonationStatusBadge from "@/src/components/UI/DonationStatusBadge";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaFileDownload,
  FaShieldAlt,
} from "react-icons/fa";
import { MdCampaign } from "react-icons/md";

interface DonationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation: UnifiedDonation | null;
  onVerifyOffline?: (donation: UnifiedDonation) => void;
  onDownloadReceipt?: (donation: UnifiedDonation) => void;
  onSendReceiptEmail?: (donation: UnifiedDonation) => void;
  isDownloadingReceipt?: boolean;
  isSendingEmail?: boolean;
  currentLang?: string;
}

export const DonationDetailModal: React.FC<DonationDetailModalProps> = ({
  isOpen,
  onClose,
  donation,
  onVerifyOffline,
  onDownloadReceipt,
  onSendReceiptEmail,
  isDownloadingReceipt = false,
  isSendingEmail = false,
  currentLang = "en",
}) => {
  const { t } = useTranslation();

  if (!donation) return null;

  const donorName =
    donation.name?.trim() ||
    `${donation.firstName || ""} ${donation.lastName || ""}`.trim() ||
    donation.donorName ||
    "—";

  const isGeneral =
    donation.type?.toLowerCase() === "general" ||
    (!donation.campaignId && !donation.campaign);

  const getCampaignTitle = (): string => {
    if (isGeneral) return t("General Welfare Fund");
    const titleObj =
      donation.campaign?.title ??
      donation.campaignTitle ??
      (donation as any).title;
    if (titleObj) {
      if (typeof titleObj === "object") {
        return (
          (titleObj as any)[currentLang] ||
          (titleObj as any).en ||
          (titleObj as any).hi ||
          "—"
        );
      }
      return String(titleObj);
    }
    return donation.campaign?.name || "—";
  };

  const isConfirmed = isDonationConfirmed(donation);
  const isOffline = donation.paymentMethod?.toLowerCase() === "offline";
  const isPendingOffline = isOffline && !isConfirmed;

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime())
        ? dateStr
        : d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
    } catch {
      return dateStr;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      showCloseButton={true}
      title={t("Donation Details") || "Donation Details"}
      description={t("Comprehensive donor and financial contribution record.") || "Comprehensive donor and financial contribution record."}
      footer={
        (isPendingOffline && onVerifyOffline) || (isConfirmed && (onDownloadReceipt || onSendReceiptEmail)) ? (
          <div className="flex flex-wrap items-center justify-end gap-3 w-full">
            {isPendingOffline && onVerifyOffline && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onVerifyOffline(donation);
                }}
                className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <FaCheckCircle className="text-xs" />
                <span>{t("Verify Offline Payment")}</span>
              </button>
            )}

            {isConfirmed && onSendReceiptEmail && donation.email && (
              <button
                type="button"
                onClick={() => onSendReceiptEmail(donation)}
                disabled={isSendingEmail}
                className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <FaEnvelope className="text-xs" />
                <span>
                  {isSendingEmail
                    ? t("Sending Receipt Email...")
                    : t("Send 80G Receipt Email")}
                </span>
              </button>
            )}

            {isConfirmed && onDownloadReceipt && (
              <button
                type="button"
                onClick={() => onDownloadReceipt(donation)}
                disabled={isDownloadingReceipt}
                className="px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <FaFileDownload className="text-xs" />
                <span>
                  {isDownloadingReceipt
                    ? t("Downloading Certificate...")
                    : t("Download 80G Certificate")}
                </span>
              </button>
            )}
          </div>
        ) : undefined
      }
    >
      <div className="space-y-4 text-gray-800 text-xs sm:text-sm">
        {/* Top Header Card */}
        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/80 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-gray-600 font-bold block">
              {t("Donation Reference / ID")}
            </span>
            <span className="font-mono text-sm sm:text-base font-bold text-gray-900 break-all select-all">
              {donation.id || donation.donationId || donation.orderId || "—"}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-gray-600 font-bold block">
              {t("Amount")}
            </span>
            <span className="text-2xl font-black text-gray-900">
              ₹{Number(donation.amount || 0).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Status & Method Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-gray-500 text-[11px] font-semibold block">{t("Payment Status")}</span>
            <div className="mt-1.5">
              <DonationStatusBadge
                status={donation.status}
                paymentMethod={donation.paymentMethod}
                receiptNumber={donation.receiptNumber}
                context="admin"
                interactive={true}
                align="left"
              />
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-gray-500 text-[11px] font-semibold block">{t("Payment Method")}</span>
            <span
              className={`font-black mt-1 uppercase text-xs inline-block px-2 py-0.5 rounded border ${
                isOffline
                  ? "bg-purple-100 text-purple-900 border-purple-300"
                  : "bg-blue-100 text-blue-900 border-blue-300"
              }`}
            >
              {donation.paymentMethod ? donation.paymentMethod.toUpperCase() : "—"}
              {donation.paymentSubMethod ? ` (${donation.paymentSubMethod})` : ""}
            </span>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 col-span-2 sm:col-span-1">
            <span className="text-gray-500 text-[11px] font-semibold block">{t("Category")}</span>
            <span className="font-bold text-gray-900 mt-1 inline-block">
              {isGeneral ? t("General Donation") : t("Campaign Donation")}
            </span>
          </div>
        </div>

        {/* Donor Information */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5 border-b border-gray-100 pb-2">
            <FaUser className="text-primaryColor" />
            {t("Donor Information")}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <span className="text-gray-500 text-[11px] block">{t("Full Name")}</span>
              <span className="font-bold text-gray-900">{donorName}</span>
            </div>

            <div>
              <span className="text-gray-500 text-[11px] block">{t("Email")}</span>
              <span className="text-gray-800 break-all flex items-center gap-1 mt-0.5 font-medium">
                <FaEnvelope className="text-gray-400 text-xs shrink-0" />
                {donation.email || "—"}
              </span>
            </div>

            <div>
              <span className="text-gray-500 text-[11px] block">{t("Phone Number")}</span>
              <span className="text-gray-800 flex items-center gap-1 mt-0.5 font-medium">
                <FaPhone className="text-gray-400 text-xs shrink-0" />
                {donation.phone || "—"}
              </span>
            </div>

            <div>
              <span className="text-gray-500 text-[11px] block">{t("Address")}</span>
              <span className="text-gray-800 flex items-start gap-1 mt-0.5 font-medium">
                <FaMapMarkerAlt className="text-gray-400 text-xs shrink-0 mt-0.5" />
                {donation.address || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Financial & Transaction Details */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5 border-b border-gray-100 pb-2">
            <FaFileInvoiceDollar className="text-primaryColor" />
            {t("Transaction & Verification Data")}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <span className="text-gray-500 text-[11px] block">{t("Campaign Title")}</span>
              <span className="font-bold text-gray-900 flex items-center gap-1 mt-0.5">
                <MdCampaign className="text-blue-600 text-sm shrink-0" />
                {getCampaignTitle()}
              </span>
            </div>

            <div>
              <span className="text-gray-500 text-[11px] block">{t("Receipt Number")}</span>
              <span className="font-mono font-bold text-gray-900">
                {donation.receiptNumber || (isConfirmed ? "Generated upon download" : "Pending Verification")}
              </span>
            </div>

            {donation.referenceNumber && (
              <div>
                <span className="text-gray-500 text-[11px] block">{t("Reference / Cheque Number")}</span>
                <span className="font-mono text-gray-900 font-semibold">{donation.referenceNumber}</span>
              </div>
            )}

            {donation.transactionId && (
              <div>
                <span className="text-gray-500 text-[11px] block">{t("Transaction ID")}</span>
                <span className="font-mono text-gray-900 break-all">{donation.transactionId}</span>
              </div>
            )}

            {donation.orderId && (
              <div>
                <span className="text-gray-500 text-[11px] block">{t("Order ID")}</span>
                <span className="font-mono text-gray-900 break-all">{donation.orderId}</span>
              </div>
            )}

            {donation.receivedAmount !== undefined && (
              <div>
                <span className="text-gray-500 text-[11px] block">{t("Amount Received")}</span>
                <span className="font-black text-emerald-700">
                  ₹{Number(donation.receivedAmount).toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Audit Trail & Timestamps */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5 border-b border-gray-100 pb-2">
            <FaShieldAlt className="text-primaryColor" />
            {t("Audit Trail & Dates")}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div>
              <span className="text-gray-500 block">{t("Created / Pledged Date")}</span>
              <span className="font-medium text-gray-800 flex items-center gap-1 mt-0.5">
                <FaCalendarAlt className="text-gray-400" />
                {formatDate(donation.createdAt)}
              </span>
            </div>

            {donation.receivedDate && (
              <div>
                <span className="text-gray-500 block">{t("Payment Received Date")}</span>
                <span className="font-medium text-gray-800 flex items-center gap-1 mt-0.5">
                  <FaCalendarAlt className="text-gray-400" />
                  {formatDate(donation.receivedDate)}
                </span>
              </div>
            )}

            {donation.verifiedAt && (
              <div>
                <span className="text-gray-500 block">{t("Verified At")}</span>
                <span className="font-medium text-gray-800 flex items-center gap-1 mt-0.5">
                  <FaCheckCircle className="text-emerald-500" />
                  {formatDate(donation.verifiedAt)}
                </span>
              </div>
            )}

            {donation.verifiedBy && (
              <div>
                <span className="text-gray-500 block">{t("Verified By")}</span>
                <span className="font-medium text-gray-800">{donation.verifiedBy}</span>
              </div>
            )}
          </div>
        </div>

        {/* Notes or Message */}
        {(donation.message || donation.notes) && (
          <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              {t("Notes / Message")}
            </h4>
            {donation.message && (
              <div>
                <span className="text-[11px] text-gray-500 block">{t("Donor Message")}:</span>
                <p className="text-xs text-gray-800 italic mt-0.5">{donation.message}</p>
              </div>
            )}
            {donation.notes && (
              <div>
                <span className="text-[11px] text-gray-500 block">{t("Admin Notes")}:</span>
                <p className="text-xs text-gray-800 mt-0.5 font-medium">{donation.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DonationDetailModal;
