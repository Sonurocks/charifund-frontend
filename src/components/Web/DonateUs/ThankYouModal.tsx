"use client";

import React, { useRef, useState, useEffect } from "react";
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
const NATIVE_CERT_HEIGHT = 520;

export default function ThankYouModal({
  isOpen,
  onClose,
  onResetDonation,
  receipt,
  paymentData,
}: ThankYouModalProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingPng, setIsExportingPng] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const updateScale = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth;
      if (containerWidth <= 0) return;

      const calculatedScale = Math.min(1, containerWidth / NATIVE_CERT_WIDTH);
      setScale(Math.max(0.2, calculatedScale));
    };

    updateScale();
    const rafId = requestAnimationFrame(updateScale);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && containerRef.current) {
      resizeObserver = new ResizeObserver(updateScale);
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", updateScale);

    return () => {
      cancelAnimationFrame(rafId);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [isOpen]);

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
        campaignTitle:
          paymentData.campaignTitle || "Charifund Welfare Initiative",
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

  if (!normalizedReceipt) return null;

  const handleDownloadPdf = async () => {
    if (isExportingPdf || isExportingPng) return;

    setIsExportingPdf(true);
    const toastId = toast.loading(
      t("Preparing your donation certificate PDF..."),
    );

    try {
      const response = await fetch("/api/donation-certificate/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receipt: normalizedReceipt,
          format: "pdf",
        }),
      });

      if (!response.ok) {
        throw new Error(`Export failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const filename = `YUWA-India-Donation-Receipt-${normalizedReceipt.receiptNumber || normalizedReceipt.paymentId || "receipt"}.pdf`;
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(t("Donation certificate downloaded successfully!"), {
        id: toastId,
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error(t("Failed to generate PDF. Please try downloading as PNG."), {
        id: toastId,
      });
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadPng = async () => {
    if (isExportingPdf || isExportingPng) return;

    setIsExportingPng(true);
    const toastId = toast.loading(t("Generating donation receipt image..."));

    try {
      const response = await fetch("/api/donation-certificate/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receipt: normalizedReceipt,
          format: "png",
        }),
      });

      if (!response.ok) {
        throw new Error(`Export failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const filename = `YUWA-India-Donation-Receipt-${normalizedReceipt.receiptNumber || normalizedReceipt.paymentId || "receipt"}.png`;
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(t("Donation receipt downloaded successfully!"), {
        id: toastId,
      });
    } catch (error) {
      console.error("PNG export error:", error);
      toast.error(t("Failed to export receipt image. Please try again."), {
        id: toastId,
      });
    } finally {
      setIsExportingPng(false);
    }
  };

  const scaledWidth = Math.round(NATIVE_CERT_WIDTH * scale);
  const scaledHeight = Math.round(NATIVE_CERT_HEIGHT * scale);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        onResetDonation();
      }}
      size="lg"
      showCloseButton={true}
    >
      <div className="flex flex-col items-center text-center p-2 sm:p-4 max-w-full">
        <div className="w-14 h-14 bg-green/10 text-green rounded-full flex items-center justify-center mb-3">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
          {t("Thank You for Your Generous Donation!")}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 max-w-lg mb-2">
          {t(
            "Your meaningful contribution makes a profound impact. A preview of your official receipt is displayed below.",
          )}
        </p>

        {normalizedReceipt.donor?.email && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-medium mb-4">
            <span>📧</span>
            <span>
              {t("A copy of this 80G receipt has been emailed to")}{" "}
              <strong className="underline">{normalizedReceipt.donor.email}</strong>
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full max-w-md mb-4">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExportingPdf || isExportingPng}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-green hover:bg-dark-green text-white text-xs font-semibold rounded-xl shadow-2xs transition transform hover:scale-[1.02] disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>
              {isExportingPdf ? t("Generating PDF...") : t("Download PDF")}
            </span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isExportingPdf || isExportingPng}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-lime-green hover:bg-green text-white text-xs font-semibold rounded-xl shadow-2xs transition transform hover:scale-[1.02] disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>
              {isExportingPng ? t("Generating PNG...") : t("Download PNG")}
            </span>
          </button>
        </div>

        <div
          ref={containerRef}
          className="w-full mt-3 flex justify-center items-center"
        >
          <div
            className="rounded shadow-sm"
            style={{
              width: `${scaledWidth}px`,
              height: `${scaledHeight}px`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${NATIVE_CERT_WIDTH}px`,
                height: `${NATIVE_CERT_HEIGHT}px`,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                position: "absolute",
                top: 0,
                left: 0,
                transition: "transform 0.1s ease-out",
              }}
            >
              <DonationCertificate receipt={normalizedReceipt} />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
