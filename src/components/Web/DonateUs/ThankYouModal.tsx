"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { CheckCircle2, FileText, Image as ImageIcon } from "lucide-react";
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

const NATIVE_CERT_WIDTH = 880;
const NATIVE_CERT_HEIGHT = 440;

export default function ThankYouModal({
  isOpen,
  onClose,
  onResetDonation,
  receipt,
  paymentData,
}: ThankYouModalProps) {
  const { t } = useTranslation();
  const certificateRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingPng, setIsExportingPng] = useState(false);

  // Dynamically compute responsive scale to eliminate horizontal scrollbars on all screens
  useEffect(() => {
    if (!isOpen) return;

    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        if (containerWidth > 0) {
          const calculatedScale = Math.min(1, containerWidth / NATIVE_CERT_WIDTH);
          setScale(calculatedScale);
        }
      }
    };

    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener("resize", updateScale);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [isOpen]);

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
      scale: 3, // Crisp 3x print quality
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
      maxWidth="max-w-5xl"
      showCloseButton={true}
      className="rounded-3xl"
    >
      <div className="flex flex-col items-center text-center space-y-2 pb-1">
        {/* Success Header Icon */}
        <div className="flex items-center justify-center w-11 h-11 bg-green/10 rounded-full mt-0.5">
          <CheckCircle2 className="w-6 h-6 text-green" />
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-dark-green font-nunito leading-tight">
          {t("Thank You for Your Donation!")}
        </h2>

        <p className="text-gray-600 text-xs max-w-xl mx-auto px-4 leading-normal">
          {t(
            "Your generous contribution has been securely received and verified. An official donation receipt has been generated below for your records."
          )}
        </p>

        {/* Action Controls for Download */}
        <div className="w-full flex flex-wrap items-center justify-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExportingPdf || isExportingPng}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0f3460] hover:bg-[#1a4a84] text-white text-xs font-semibold rounded-xl shadow-2xs transition transform hover:scale-[1.02] disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isExportingPdf ? t("Generating PDF...") : t("Download PDF")}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isExportingPdf || isExportingPng}
            className="flex items-center gap-1.5 px-4 py-2 bg-lime-green hover:bg-green text-white text-xs font-semibold rounded-xl shadow-2xs transition transform hover:scale-[1.02] disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{isExportingPng ? t("Generating PNG...") : t("Download PNG")}</span>
          </button>
        </div>

        {/* Certificate Display Area with Responsive Auto-Scaling (No scrollbars on desktop or mobile) */}
        <div
          ref={containerRef}
          className="w-full mt-3 bg-gray-50/80 p-1 sm:p-2.5 rounded-2xl border border-gray-200/80 flex justify-center items-center overflow-hidden"
          style={{
            height: `${Math.round(NATIVE_CERT_HEIGHT * scale + 16)}px`,
            minHeight: "150px",
          }}
        >
          <div
            style={{
              width: `${NATIVE_CERT_WIDTH}px`,
              height: `${NATIVE_CERT_HEIGHT}px`,
              transform: `scale(${scale})`,
              transformOrigin: "top center",
              transition: "transform 0.1s ease-out",
            }}
          >
            <DonationCertificate ref={certificateRef} receipt={normalizedReceipt} />
          </div>
        </div>
      </div>
    </Modal>
  );
}
