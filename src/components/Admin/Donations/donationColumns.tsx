import React from "react";
import { UnifiedDonation } from "@/src/types/admin/donation";
import { FaEye, FaCheck, FaFileDownload, FaEnvelope } from "react-icons/fa";

interface ColumnOptions {
  lang?: string;
  currentPage?: number;
  limit?: number;
  onViewDetails?: (row: UnifiedDonation) => void;
  onVerifyOffline?: (row: UnifiedDonation) => void;
  onDownloadReceipt?: (row: UnifiedDonation) => void;
  onSendReceiptEmail?: (row: UnifiedDonation) => void;
}

export const isDonationConfirmed = (row: UnifiedDonation): boolean => {
  const statusLower = (row.status || "").toLowerCase().trim();
  const isOffline = (row.paymentMethod || "").toLowerCase().trim() === "offline";

  if (isOffline) {
    return statusLower === "verified" || statusLower === "paid" || statusLower === "completed";
  }

  if (
    statusLower === "completed" ||
    statusLower === "success" ||
    statusLower === "paid"
  ) {
    return true;
  }
  return false;
};

export const hasValidEmail = (email?: string | null): boolean => {
  if (!email || typeof email !== "string") return false;
  const clean = email.trim();
  return clean !== "" && clean !== "-" && clean.includes("@");
};

export const getDonationColumns = ({
  lang = "en",
  currentPage = 1,
  limit = 10,
  onViewDetails,
  onVerifyOffline,
  onDownloadReceipt,
  onSendReceiptEmail,
}: ColumnOptions = {}) => [
  {
    name: "SNo",
    cell: (_row: UnifiedDonation, index: number) => (
      <span className="whitespace-nowrap font-medium text-gray-700">
        {(currentPage - 1) * limit + index + 1}
      </span>
    ),
    width: "95px",
  },
  {
    name: "Donor Name",
    selector: (row: UnifiedDonation) => {
      if (row.name?.trim()) return row.name.trim();
      const full = `${row.firstName || ""} ${row.lastName || ""}`.trim();
      return full || row.donorName || "-";
    },
    cell: (row: UnifiedDonation) => {
      if (row.name?.trim()) {
        return <span className="font-semibold text-gray-900 truncate block max-w-full">{row.name.trim()}</span>;
      }
      const full = `${row.firstName || ""} ${row.lastName || ""}`.trim();
      const name = full || row.donorName;
      if (name) {
        return <span className="font-semibold text-gray-900 truncate block max-w-full">{name}</span>;
      }
      return <span className="text-gray-400">-</span>;
    },
    sortable: true,
    width: "160px",
    grow: 1.5,
  },
  {
    name: "Email",
    selector: (row: UnifiedDonation) => row.email || "-",
    cell: (row: UnifiedDonation) =>
      row.email ? (
        <span className="text-gray-700 truncate block max-w-full font-normal" title={row.email}>
          {row.email}
        </span>
      ) : (
        <span className="text-gray-400">-</span>
      ),
    width: "170px",
    grow: 1.5,
  },
  {
    name: "Phone",
    selector: (row: UnifiedDonation) => row.phone || "-",
    cell: (row: UnifiedDonation) =>
      row.phone ? (
        <span className="text-gray-700 font-normal whitespace-nowrap">{row.phone}</span>
      ) : (
        <span className="text-gray-400">-</span>
      ),
    width: "120px",
    grow: 0.8,
  },
  {
    name: "Type",
    cell: (row: UnifiedDonation) => {
      const isGeneral =
        row.type?.toLowerCase() === "general" ||
        (!row.campaignId && !row.campaign);
      return (
        <span
          className={`text-xs font-semibold whitespace-nowrap ${
            isGeneral ? "text-[#7e22ce]" : "text-[#1d4ed8]"
          }`}
        >
          {isGeneral ? "General" : "Campaign"}
        </span>
      );
    },
    width: "95px",
    grow: 0.6,
  },
  {
    name: "Campaign",
    selector: (row: UnifiedDonation) => {
      if (!row.campaignId && !row.campaign) return "-";
      const titleObj =
        row.campaign?.title ?? row.campaignTitle ?? (row as any).title;
      if (titleObj) {
        if (typeof titleObj === "object") {
          return (
            (titleObj as any)[lang] ||
            (titleObj as any).en ||
            (titleObj as any).hi ||
            "-"
          );
        }
        return String(titleObj);
      }
      return row.campaign?.name || "-";
    },
    cell: (row: UnifiedDonation) => {
      const isGeneral =
        row.type?.toLowerCase() === "general" ||
        (!row.campaignId && !row.campaign);

      if (isGeneral || (!row.campaign && !row.campaignId)) {
        return <span className="text-gray-400">-</span>;
      }

      const titleObj =
        row.campaign?.title ?? row.campaignTitle ?? (row as any).title;
      let titleStr = "";
      if (titleObj) {
        if (typeof titleObj === "object") {
          titleStr =
            (titleObj as any)[lang] ||
            (titleObj as any).en ||
            (titleObj as any).hi ||
            "";
        } else {
          titleStr = String(titleObj);
        }
      } else if (row.campaign?.name) {
        titleStr = row.campaign.name;
      }

      if (!titleStr.trim()) {
        return <span className="text-gray-400">-</span>;
      }

      return (
        <span className="font-medium text-gray-800 line-clamp-1" title={titleStr}>
          {titleStr}
        </span>
      );
    },
    sortable: true,
    width: "170px",
    grow: 1.8,
  },
  {
    name: "Method",
    cell: (row: UnifiedDonation) => {
      const isOnline = row.paymentMethod?.toLowerCase() === "online";
      return isOnline ? (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe] whitespace-nowrap shadow-xs">
          ONLINE
        </span>
      ) : (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#f3e8ff] text-[#6b21a8] border border-[#d8b4fe] whitespace-nowrap shadow-xs">
          OFFLINE
        </span>
      );
    },
    width: "105px",
    grow: 0.6,
  },
  {
    name: "Amount",
    selector: (row: UnifiedDonation) => row.amount,
    cell: (row: UnifiedDonation) => (
      <span className="font-bold text-gray-900 whitespace-nowrap">
        ₹{Number(row.amount || 0).toLocaleString("en-IN")}
      </span>
    ),
    sortable: true,
    width: "115px",
    grow: 0.7,
  },
  {
    name: "Status",
    cell: (row: UnifiedDonation) => {
      const isConfirmed = isDonationConfirmed(row);
      const isOffline = row.paymentMethod?.toLowerCase() === "offline";
      const statusLower = (row.status || "").toLowerCase().trim();
      const isFailed =
        statusLower === "failed" ||
        statusLower === "rejected" ||
        statusLower === "cancelled";

      let badgeClasses = "bg-[#fef3c7] text-[#92400e] border-[#fcd34d]";
      let displayLabel = isOffline ? "Unverified" : "Pending";

      if (isConfirmed) {
        badgeClasses = "bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]";
        displayLabel = isOffline ? "Verified" : "Paid";
      } else if (isFailed) {
        badgeClasses = "bg-[#fef2f2] text-[#991b1b] border-[#fecaca]";
        displayLabel = "Failed";
      }

      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${badgeClasses} whitespace-nowrap shadow-xs`}
        >
          {displayLabel}
        </span>
      );
    },
    width: "125px",
    grow: 0.8,
  },
  {
    name: "Date",
    selector: (row: UnifiedDonation) => row.createdAt,
    cell: (row: UnifiedDonation) => {
      if (!row.createdAt) return "-";
      try {
        const d = new Date(row.createdAt);
        return isNaN(d.getTime())
          ? "-"
          : d.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
      } catch {
        return "-";
      }
    },
    sortable: true,
    width: "115px",
    grow: 0.8,
  },
  {
    name: "Actions",
    cell: (row: UnifiedDonation) => {
      const isConfirmed = isDonationConfirmed(row);
      const isOffline = (row.paymentMethod || "").toLowerCase().trim() === "offline";
      const isPendingOffline = isOffline && !isConfirmed;
      const canEmail = isConfirmed && !isPendingOffline && hasValidEmail(row.email);

      return (
        <div className="flex items-center gap-1.5 py-1">
          {onViewDetails && (
            <button
              type="button"
              onClick={() => onViewDetails(row)}
              className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-white hover:bg-gray-100 text-gray-700 hover:text-gray-900 border border-gray-200 transition-colors cursor-pointer shadow-2xs"
              title="View donation details"
              aria-label="View donation details"
            >
              <FaEye className="w-3.5 h-3.5 text-gray-600" />
            </button>
          )}

          {isPendingOffline && onVerifyOffline && (
            <button
              type="button"
              onClick={() => onVerifyOffline(row)}
              className="inline-flex items-center gap-1 px-2.5 h-7 rounded-md bg-[#00715D] hover:bg-[#005a4a] text-white transition-colors cursor-pointer text-[11px] font-bold whitespace-nowrap shadow-2xs"
              title="Verify offline payment"
              aria-label="Verify offline payment"
            >
              <FaCheck className="w-2.5 h-2.5 text-white" />
              <span>Verify</span>
            </button>
          )}

          {isConfirmed && onDownloadReceipt && (
            <button
              type="button"
              onClick={() => onDownloadReceipt(row)}
              className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-colors cursor-pointer shadow-2xs"
              title="Download 80G Certificate PDF"
              aria-label="Download donation certificate"
            >
              <FaFileDownload className="w-3.5 h-3.5 text-sky-600" />
            </button>
          )}

          {canEmail && onSendReceiptEmail && (
            <button
              type="button"
              onClick={() => onSendReceiptEmail(row)}
              className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer shadow-2xs"
              title={`Send 80G receipt & certificate email to ${row.email}`}
              aria-label="Send receipt email"
            >
              <FaEnvelope className="w-3.5 h-3.5 text-emerald-600" />
            </button>
          )}
        </div>
      );
    },
    width: "140px",
    grow: 0,
  },
];


