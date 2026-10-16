"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Info,
  X,
  Check,
  FileText,
  FileCheck2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  CanonicalDonationStatus,
  StatusConfig,
  getCanonicalDonationStatus,
  getStatusConfig,
} from "@/src/utils/donationStatus";

export type { CanonicalDonationStatus, StatusConfig };
export { getCanonicalDonationStatus, getStatusConfig };

export interface DonationStatusBadgeProps {
  status?: string;
  paymentMethod?: string;
  receiptNumber?: string | null;
  context?: "donor" | "admin";
  size?: "sm" | "md";
  interactive?: boolean;
  className?: string;
  customLabel?: string;
  align?: "left" | "right";
}

/**
 * Reusable, accessible, and interactive status badge component with popover tooltip.
 */
export default function DonationStatusBadge({
  status,
  paymentMethod,
  receiptNumber,
  context = "donor",
  size = "md",
  interactive = false,
  className = "",
  customLabel,
  align = "left",
}: DonationStatusBadgeProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const config = getStatusConfig(status, paymentMethod, context, t, receiptNumber);
  const StatusIcon = config.icon;
  const displayLabel = customLabel || config.label;

  // Handle outside clicks
  const handleClickOutside = useCallback((event: MouseEvent | TouchEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  // Handle ESC key
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClickOutside, handleKeyDown]);

  const sizeClasses =
    size === "sm"
      ? "text-[11px] px-2 py-0.5 gap-1.5"
      : "text-xs px-2.5 py-1 gap-1.5";

  const iconSize = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";
  const dotSize = size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2";

  // Static badge for data tables
  if (!interactive) {
    return (
      <span
        className={`inline-flex items-center rounded-full font-semibold border transition-colors shadow-2xs ${sizeClasses} ${config.badgeClasses} ${className}`}
      >
        <span className={`${dotSize} rounded-full shrink-0 ${config.dotClass}`} />
        <StatusIcon className={`${iconSize} shrink-0`} />
        <span className="truncate">{displayLabel}</span>
      </span>
    );
  }

  // Interactive badge with popover
  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        title={t("Click for status details")}
        className={`inline-flex items-center rounded-full font-semibold border transition-all shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 select-none ${sizeClasses} ${config.badgeClasses}`}
      >
        <span className={`${dotSize} rounded-full shrink-0 ${config.dotClass}`} />
        <StatusIcon className={`${iconSize} shrink-0`} />
        <span>{displayLabel}</span>
        <Info className="w-3 h-3 opacity-60 hover:opacity-100 transition-opacity ml-0.5 shrink-0" />
      </button>

      {/* Accessible Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={t("Status Details")}
          className={`absolute z-50 mt-1.5 w-72 max-w-[calc(100vw-2.5rem)] rounded-xl border border-gray-200 bg-white p-3 shadow-xl text-left animate-in fade-in-50 zoom-in-95 duration-150 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
            <div className="flex items-center gap-1.5 font-bold text-gray-900 text-xs">
              <StatusIcon className="w-3.5 h-3.5 text-amber-600" />
              <span>{config.title}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-0.5 rounded transition-colors cursor-pointer"
              aria-label={t("Close status details")}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Description */}
          <p className="text-[11px] leading-relaxed text-gray-600">
            {config.description}
          </p>

          {/* Status Note */}
          {config.canonical === "pending_payment" && (
            <div className="mt-2.5 pt-2 border-t border-gray-100 text-[10px] text-amber-700 bg-amber-50/60 p-1.5 rounded">
              💡 {t("Keep your reference ID handy when visiting our office or depositing funds.")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export interface DonationProgressStepperProps {
  status?: string;
  paymentMethod?: string;
  className?: string;
}

/**
 * 3-stage visual progress stepper tracking offline and online donation lifecycle:
 * 1. Request Submitted
 * 2. Payment Received
 * 3. Verified & Receipt Ready
 */
export function DonationProgressStepper({
  status,
  paymentMethod,
  className = "",
}: DonationProgressStepperProps) {
  const { t } = useTranslation();
  const canonical = getCanonicalDonationStatus(status, paymentMethod, "donor");

  const isConfirmed = canonical === "confirmed";
  const isFailed = canonical === "failed";

  // Step 1: Request Submitted (always completed for registered pledges/orders)
  // Step 2: Payment Received
  const step2Completed = isConfirmed;
  const step2Active = !isConfirmed && !isFailed;
  const step2Failed = isFailed;

  // Step 3: Verified & Receipt Ready
  const step3Completed = isConfirmed;

  // Step 2 styling
  const step2CircleClasses = step2Completed
    ? "bg-emerald-100 text-emerald-700 border-emerald-300"
    : step2Failed
    ? "bg-rose-100 text-rose-700 border-rose-300"
    : "bg-amber-100 text-amber-800 border-2 border-amber-400 ring-2 ring-amber-100";

  const Step2Icon = step2Completed ? Check : step2Failed ? X : Clock;
  const step2Subtitle = step2Completed
    ? t("Payment confirmed")
    : step2Failed
    ? t("Payment not completed")
    : t("Awaiting payment");

  // Step 3 styling
  const step3CircleClasses = step3Completed
    ? "bg-emerald-100 text-emerald-700 border-emerald-300"
    : "bg-gray-100 text-gray-400 border-gray-200";

  const Step3Icon = step3Completed ? FileCheck2 : FileText;
  const step3Subtitle = step3Completed
    ? t("Receipt ready")
    : step2Failed
    ? t("Unavailable")
    : t("Pending verification");

  // Connector lines
  const connector1Class = step2Completed
    ? "bg-emerald-500"
    : step2Active
    ? "bg-gradient-to-r from-emerald-400 to-amber-300"
    : step2Failed
    ? "bg-rose-300"
    : "bg-gray-200";

  const connector2Class = step3Completed ? "bg-emerald-500" : "bg-gray-200";

  return (
    <div
      className={`p-3 bg-gray-50/90 border border-gray-200/90 rounded-xl space-y-2.5 ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
          {t("Donation Progress")}
        </span>
        <span className="text-[10px] font-semibold text-gray-700">
          {isConfirmed
            ? t("Stage 3 of 3: Completed")
            : isFailed
            ? t("Stage 2: Cancelled")
            : t("Stage 2 of 3: Payment Next")}
        </span>
      </div>

      {/* Desktop Horizontal Stepper */}
      <div className="hidden sm:flex items-center justify-between gap-1 pt-1">
        {/* Step 1 */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300 shadow-2xs">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900 leading-tight">
              {t("Request Submitted")}
            </p>
            <p className="text-[10px] text-gray-500">{t("Pledge registered")}</p>
          </div>
        </div>

        {/* Connector 1 */}
        <div className={`h-0.5 flex-1 mx-2 ${connector1Class} transition-colors`} />

        {/* Step 2 */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border shadow-2xs transition-all ${step2CircleClasses}`}
          >
            <Step2Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900 leading-tight">
              {t("Payment Received")}
            </p>
            <p className="text-[10px] text-gray-500">{step2Subtitle}</p>
          </div>
        </div>

        {/* Connector 2 */}
        <div className={`h-0.5 flex-1 mx-2 ${connector2Class} transition-colors`} />

        {/* Step 3 */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border shadow-2xs ${step3CircleClasses}`}
          >
            <Step3Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900 leading-tight">
              {t("Verified & Receipt Ready")}
            </p>
            <p className="text-[10px] text-gray-500">{step3Subtitle}</p>
          </div>
        </div>
      </div>

      {/* Mobile Vertical Stepper (< 640px) */}
      <div className="sm:hidden space-y-2 pt-0.5">
        {/* Step 1 */}
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300 mt-0.5 shadow-2xs">
            <Check className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-900 leading-tight">
              {t("1. Request Submitted")}
            </p>
            <p className="text-[10px] text-gray-500">{t("Pledge registered")}</p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start gap-2.5">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border mt-0.5 shadow-2xs ${step2CircleClasses}`}
          >
            <Step2Icon className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-900 leading-tight">
              {t("2. Payment Received")}
            </p>
            <p className="text-[10px] text-gray-500">{step2Subtitle}</p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start gap-2.5">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border mt-0.5 shadow-2xs ${step3CircleClasses}`}
          >
            <Step3Icon className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-900 leading-tight">
              {t("3. Verified & Receipt Ready")}
            </p>
            <p className="text-[10px] text-gray-500">{step3Subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
