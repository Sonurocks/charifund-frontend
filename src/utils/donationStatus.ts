import React from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";

export type CanonicalDonationStatus =
  | "pending_payment"
  | "pending_verification"
  | "confirmed"
  | "failed"
  | "refunded"
  | "unknown";

export interface StatusConfig {
  canonical: CanonicalDonationStatus;
  label: string;
  badgeClasses: string;
  dotClass: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

/**
 * Normalizes backend donation statuses and payment methods into a canonical business status.
 */
export function getCanonicalDonationStatus(
  status?: string,
  paymentMethod?: string,
  context: "donor" | "admin" = "donor"
): CanonicalDonationStatus {
  const s = (status || "").toLowerCase().trim();
  const m = (paymentMethod || "").toLowerCase().trim();
  const isOffline = m === "offline";

  if (s === "completed" || s === "success" || s === "paid" || s === "verified") {
    return "confirmed";
  }

  if (s === "failed" || s === "rejected" || s === "cancelled") {
    return "failed";
  }

  if (s === "refunded" || s === "reversed") {
    return "refunded";
  }

  if (s === "pending" || s === "offline" || s === "unverified" || s === "pledged" || !s) {
    if (isOffline) {
      return context === "admin" ? "pending_verification" : "pending_payment";
    }
    return "pending_payment";
  }

  return "unknown";
}

/**
 * Returns configuration (colors, icons, titles, descriptions) for a canonical status.
 */
export function getStatusConfig(
  status?: string,
  paymentMethod?: string,
  context: "donor" | "admin" = "donor",
  t: (key: string) => string = (k) => k
): StatusConfig {
  const canonical = getCanonicalDonationStatus(status, paymentMethod, context);

  switch (canonical) {
    case "pending_payment":
      return {
        canonical,
        label: context === "admin" ? t("Offline") : t("Pending Payment"),
        badgeClasses:
          "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 hover:border-amber-400 focus:ring-amber-400",
        dotClass: "bg-amber-500",
        icon: Clock,
        title: t("Pending Payment"),
        description: t(
          "Your donation request has been registered. Please complete your offline payment using the provided instructions. The donation will be confirmed after the payment is received and verified."
        ),
      };

    case "pending_verification":
      return {
        canonical,
        label: context === "admin" ? t("Offline") : t("Pending Verification"),
        badgeClasses:
          "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 hover:border-amber-400 focus:ring-amber-400",
        dotClass: "bg-amber-500",
        icon: Clock,
        title: t("Pending Verification"),
        description: t(
          "Offline donation pledge recorded. Payment handover or bank deposit is awaiting manual accounting review and verification."
        ),
      };

    case "confirmed":
      return {
        canonical,
        label: context === "admin" ? t("Paid") : t("Paid & Verified"),
        badgeClasses:
          "bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400 focus:ring-emerald-400",
        dotClass: "bg-emerald-500",
        icon: CheckCircle2,
        title: t("Payment Confirmed"),
        description: t(
          "Payment has been received, verified, and officially accounted for. Your formal donation receipt is available."
        ),
      };

    case "failed":
      return {
        canonical,
        label: t("Cancelled / Failed"),
        badgeClasses:
          "bg-rose-50 text-rose-900 border-rose-300 hover:bg-rose-100 hover:border-rose-400 focus:ring-rose-400",
        dotClass: "bg-rose-500",
        icon: XCircle,
        title: t("Payment Cancelled"),
        description: t(
          "This donation request was cancelled, rejected, or could not be completed by the payment system."
        ),
      };

    case "refunded":
      return {
        canonical,
        label: t("Refunded"),
        badgeClasses:
          "bg-purple-50 text-purple-900 border-purple-300 hover:bg-purple-100 hover:border-purple-400 focus:ring-purple-400",
        dotClass: "bg-purple-500",
        icon: RotateCcw,
        title: t("Payment Refunded"),
        description: t(
          "This contribution has been refunded or reversed by the organization administration."
        ),
      };

    case "unknown":
    default:
      return {
        canonical: "unknown",
        label: status || t("Pending"),
        badgeClasses:
          "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 focus:ring-gray-400",
        dotClass: "bg-gray-400",
        icon: Clock,
        title: t("Donation Status"),
        description: t("Current recorded status of this donation request in our system."),
      };
  }
}
