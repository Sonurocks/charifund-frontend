"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Copy,
  Check,
  Building,
  Phone,
  Mail,
  MapPin,
  Heart,
  Clock,
  CreditCard,
  FileText,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
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
  const donorName = pledgeData.donorName || "Supporter";
  const campaignName = pledgeData.campaignTitle || t("General Welfare Fund");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      showCloseButton={true}
      title={t("Donation Request Submitted")}
      description={t("Thank you! Your offline donation request has been recorded.")}
      headerIcon={
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
          <Heart className="w-5 h-5 fill-emerald-600 text-emerald-600" />
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full gap-3">
          <p className="text-[11px] text-gray-500 hidden sm:block">
            {t("Need help? Call our helpline: +91 8565006669")}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-7 py-2.5 bg-[#00715D] hover:bg-[#005a4a] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t("Done / Close")}</span>
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-gray-800">
        {/* Warm Greeting Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200/80 rounded-2xl p-3.5 sm:p-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm sm:text-base font-extrabold text-[#005a4a]">
              {t("Thank you, {{name}}!", { name: donorName })}
            </h4>
            <p className="text-xs text-gray-700 mt-0.5 leading-relaxed">
              {t("Someone from our organisation will contact you shortly, or you can simply visit our office to complete your donation.")}
            </p>
          </div>
          <div className="shrink-0 bg-white/90 border border-emerald-200 rounded-xl px-4 py-2 text-right shadow-xs">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">
              {t("Pledged Amount")}
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#00715D] leading-none">
              ₹{formattedAmount}
            </span>
          </div>
        </div>

        {/* 2-Column Responsive Layout: Left (Pledge & Steps), Right (Office & Contact) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* LEFT COLUMN: Reference & Simple Steps */}
          <div className="space-y-3.5">
            {/* Reference ID Neumorphic Box */}
            <div className="bg-white rounded-2xl p-3.5 border border-gray-200/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.04)] space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] uppercase tracking-wider font-bold text-gray-500">
                  {t("Donation Reference ID")}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-100 text-amber-800 border border-amber-300">
                  <Clock className="w-2.5 h-2.5 mr-1" />
                  {t("Unverified Pledge")}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                <span className="font-mono text-xs sm:text-sm font-bold text-gray-900 break-all select-all">
                  {pledgeData.donationId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-gray-100 text-[#00715D] border border-[#00715D]/30 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer shrink-0"
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">{t("Copied!")}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t("Copy ID")}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-gray-600">
                <div>
                  <span className="text-gray-400 block">{t("Donor Phone")}:</span>
                  <span className="font-semibold text-gray-900">{pledgeData.donorPhone || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">{t("Campaign")}:</span>
                  <span className="font-semibold text-gray-900 truncate block" title={campaignName}>
                    {campaignName}
                  </span>
                </div>
              </div>
            </div>

            {/* Simple 3 Easy Steps */}
            <div className="bg-white rounded-2xl p-3.5 border border-gray-200/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.04)] space-y-2">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00715D]" />
                {t("How to Complete Your Donation")}
              </h5>

              <div className="space-y-2 pt-0.5">
                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-gray-50/80 border border-gray-100">
                  <div className="w-6 h-6 rounded-full bg-[#00715D] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    1
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-gray-900 leading-tight">
                      {t("Save Your Reference ID")}
                    </p>
                    <p className="text-[11px] text-gray-600 leading-normal mt-0.5">
                      {t("Keep the ID above handy when speaking with our volunteer or visiting the office.")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-gray-50/80 border border-gray-100">
                  <div className="w-6 h-6 rounded-full bg-[#00715D] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    2
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-gray-900 leading-tight">
                      {t("Pay via Cash, Cheque, or Bank Transfer")}
                    </p>
                    <p className="text-[11px] text-gray-600 leading-normal mt-0.5">
                      {t("Pay in-person at our office or deposit directly to our verified bank account.")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-gray-50/80 border border-gray-100">
                  <div className="w-6 h-6 rounded-full bg-[#00715D] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    3
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-gray-900 leading-tight">
                      {t("Get Official 80G Tax Receipt")}
                    </p>
                    <p className="text-[11px] text-gray-600 leading-normal mt-0.5">
                      {t("Our team records the payment, and you receive an official instant 80G tax receipt.")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Bold Office Details & Contacts */}
          <div className="space-y-3.5">
            <div className="bg-white rounded-2xl p-4 border border-gray-200/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.04)] space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#00715D]" />
                  <h5 className="text-xs font-black uppercase tracking-wider text-gray-900">
                    {t("Visit Our Official Offices")}
                  </h5>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  YUWA INDIA (Reg. 8902080)
                </span>
              </div>

              {/* Head Office Card in Bold Neumorphic Style */}
              <div className="p-3 rounded-xl bg-gray-50/90 border border-gray-200/80 shadow-xs space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-gray-900">
                  <MapPin className="w-3.5 h-3.5 text-[#00715D] shrink-0" />
                  <span>{t("HEAD OFFICE (NEW DELHI)")}</span>
                </div>
                <p className="text-xs font-bold text-gray-800 leading-relaxed pl-5">
                  H.No. RZC-13, Kh. No. 72/23, 78/3, Nihal Vihar, Nangloi, New Delhi-110041, India
                </p>
              </div>

              {/* Branch Office Card in Bold Neumorphic Style */}
              <div className="p-3 rounded-xl bg-gray-50/90 border border-gray-200/80 shadow-xs space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-gray-900">
                  <MapPin className="w-3.5 h-3.5 text-[#00715D] shrink-0" />
                  <span>{t("BRANCH OFFICE (GORAKHPUR, U.P.)")}</span>
                </div>
                <p className="text-xs font-bold text-gray-800 leading-relaxed pl-5">
                  Behind Sankat Mochan Hanuman Mandir, Azad Nagar Colony East, Taramandal Road, Rustampur, Gorakhpur, Uttar Pradesh-273016, India
                </p>
              </div>

              {/* Helpline & Email Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                <a
                  href="tel:+918565006669"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 hover:bg-emerald-100/60 transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#00715D] shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-500 font-semibold block uppercase">
                      {t("Helpline / Call")}
                    </span>
                    <span className="font-extrabold text-gray-900 text-xs">
                      +91 8565006669
                    </span>
                  </div>
                </a>

                <a
                  href="mailto:yuwaaindia@gmail.com"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 hover:bg-emerald-100/60 transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-[#00715D] shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-500 font-semibold block uppercase">
                      {t("Official Email")}
                    </span>
                    <span className="font-extrabold text-gray-900 text-xs truncate block">
                      yuwaaindia@gmail.com
                    </span>
                  </div>
                </a>
              </div>

              {/* Accepted Offline Modes */}
              <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
                <CreditCard className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  <strong className="font-bold text-amber-950">{t("Accepted Payment Modes")}: </strong>
                  {t("Cash at office, Cheque or Demand Draft payable to 'Youth Util Welfare Association', or Bank Transfer (NEFT/IMPS).")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
