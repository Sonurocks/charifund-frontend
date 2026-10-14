"use client";

import React, { useRef, useState, useCallback } from "react";
import { CheckCircle2, FileText, Image as ImageIcon, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import Modal from "../../UI/web/Modal";
import DonationCertificate from "./DonationCertificate";
import { DonationReceipt } from "@/src/types/web/receipt";

export interface LegacyPaymentData {
  amount: number;
  paymentId: string;
  orderId: string;
  status: string;
  date: string;
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  donorAddress?: string;
  campaignTitle?: string;
}

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetDonation: () => void;
  receipt?: DonationReceipt | null;
  paymentData?: LegacyPaymentData | null;
}

export default function ThankYouModal({
  isOpen,
  onClose,
  onResetDonation,
  receipt,
  paymentData,
}: ThankYouModalProps) {
  const { t } = useTranslation();
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingPng, setIsExportingPng] = useState(false);

  // Normalise receipt data
  const normalizedReceipt: DonationReceipt | null = React.useMemo(() => {
    if (receipt) return receipt;
    if (paymentData) {
      return {
        receiptNumber: `RCP-${paymentData.paymentId ? paymentData.paymentId.slice(-8).toUpperCase() : "DONATION"}`,
        orderId: paymentData.orderId || "N/A",
        paymentId: paymentData.paymentId || "N/A",
        paymentMethod: "Online (Razorpay)",
        paymentStatus: paymentData.status || "Completed",
        paymentDate: paymentData.date || new Date().toISOString(),
        amount: paymentData.amount || 0,
        campaignTitle: paymentData.campaignTitle || "Charifund Welfare Initiative",
        donor: {
          name: paymentData.donorName || "Generous Supporter",
          email: paymentData.donorEmail,
          phone: paymentData.donorPhone,
          address: paymentData.donorAddress,
        },
        isVerified: true,
      };
    }
    return null;
  }, [receipt, paymentData]);

  const captureCertificateCanvas = useCallback(async (element: HTMLElement) => {
    const html2canvas = (await import("html2canvas")).default;

    return html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
      onclone: (clonedDoc) => {
        // Sanitize modern CSS color spaces (lab, oklch) in cloned stylesheets that html2canvas cannot parse
        const styles = clonedDoc.querySelectorAll("style");
        styles.forEach((styleTag) => {
          if (
            styleTag.textContent &&
            (styleTag.textContent.includes("lab(") ||
              styleTag.textContent.includes("oklch("))
          ) {
            styleTag.textContent = styleTag.textContent
              .replace(/lab\([^)]+\)/gi, "rgba(17, 24, 39, 0.8)")
              .replace(/oklch\([^)]+\)/gi, "rgba(17, 24, 39, 0.8)");
          }
        });
      },
    });
  }, []);

  if (!normalizedReceipt) return null;

  const handleDownloadPdf = async () => {
    if (isExportingPdf || isExportingPng) return;
    if (!certificateRef.current) {
      toast.error(t("Certificate element not ready for export. Please try again."));
      return;
    }

    setIsExportingPdf(true);
    const toastId = toast.loading(t("Preparing your donation certificate PDF..."));

    try {
      const { jsPDF } = await import("jspdf");
      const element = certificateRef.current;

      const canvas = await captureCertificateCanvas(element);
      const imgData = canvas.toDataURL("image/png");

      // Landscape A5 dimensions in mm: 210 x 148
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a5",
        compress: true,
      });

      const pdfWidth = 210;
      const pdfHeight = 148;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");

      const filename = `YUWA-India-Donation-Receipt-${normalizedReceipt.receiptNumber || normalizedReceipt.paymentId}.pdf`;
      pdf.save(filename);

      toast.success(t("Donation certificate downloaded successfully!"), { id: toastId });
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error(t("Failed to generate PDF. Please try downloading as PNG."), { id: toastId });
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadPng = async () => {
    if (isExportingPdf || isExportingPng) return;
    if (!certificateRef.current) {
      toast.error(t("Certificate element not ready for export. Please try again."));
      return;
    }

    setIsExportingPng(true);
    const toastId = toast.loading(t("Generating donation receipt image..."));

    try {
      const element = certificateRef.current;
      const canvas = await captureCertificateCanvas(element);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            toast.error(t("Failed to export image."), { id: toastId });
            setIsExportingPng(false);
            return;
          }

          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = `YUWA-India-Donation-Receipt-${normalizedReceipt.receiptNumber || normalizedReceipt.paymentId}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Clean up temporary blob URL
          setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
          toast.success(t("Donation certificate image saved!"), { id: toastId });
          setIsExportingPng(false);
        },
        "image/png",
        1.0
      );
    } catch (error) {
      console.error("PNG export error:", error);
      toast.error(t("Failed to export image. Please try again."), { id: toastId });
      setIsExportingPng(false);
    }
  };

  const handleFinish = () => {
    onClose();
    onResetDonation();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleFinish}
      maxWidth="max-w-4xl"
      showCloseButton={true}
      className="rounded-3xl"
    >
      <div className="flex flex-col items-center text-center space-y-3 pb-2">
        {/* Success Header Icon */}
        <div className="flex items-center justify-center w-14 h-14 bg-green/10 rounded-full mt-1">
          <CheckCircle2 className="w-8 h-8 text-green" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-dark-green font-nunito">
          {t("Thank You for Your Donation!")}
        </h2>

        <p className="text-gray-600 text-xs sm:text-sm max-w-xl mx-auto px-4">
          {t(
            "Your generous contribution has been securely received and verified. An official donation receipt has been generated below for your records."
          )}
        </p>

        {/* Action Controls for Download */}
        <div className="w-full flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExportingPdf || isExportingPng}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0f3460] hover:bg-[#1a4a84] text-white text-xs font-semibold rounded-xl shadow-xs transition transform hover:scale-[1.02] disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>{isExportingPdf ? t("Generating PDF...") : t("Download PDF")}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isExportingPdf || isExportingPng}
            className="flex items-center gap-2 px-5 py-2.5 bg-lime-green hover:bg-green text-white text-xs font-semibold rounded-xl shadow-xs transition transform hover:scale-[1.02] disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
          >
            <ImageIcon className="w-4 h-4" />
            <span>{isExportingPng ? t("Generating PNG...") : t("Download PNG")}</span>
          </button>
        </div>

        {/* Certificate Display Area with horizontal scroll on small screens */}
        <div className="w-full mt-4 bg-gray-100/60 p-2 sm:p-4 rounded-2xl border border-gray-200/80 overflow-x-auto shadow-inner">
          <div className="min-w-[794px] mx-auto flex justify-center">
            <DonationCertificate ref={certificateRef} receipt={normalizedReceipt} />
          </div>
        </div>
        <p className="text-[11px] text-gray-500 sm:hidden flex items-center justify-center gap-1">
          <span>⇄</span> <span>{t("Swipe horizontally to view full certificate")}</span>
        </p>

        {/* Done Button
        <div className="flex justify-center w-full pt-4">
          <button
            type="button"
            onClick={handleFinish}
            className="w-full sm:w-1/2 cursor-pointer py-3 px-6 bg-green hover:bg-dark-green text-white font-semibold rounded-xl transition-colors duration-200 text-sm shadow-xs flex items-center justify-center gap-2"
          >
            <span>{t("Done & Return to Homepage")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div> */}
      </div>
    </Modal>
  );
}
