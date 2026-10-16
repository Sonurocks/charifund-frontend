import React from "react";
import { UnifiedDonation } from "@/src/types/admin/donation";
import { FaEye, FaCheck, FaFileDownload } from "react-icons/fa";

interface ColumnOptions {
  lang?: string;
  currentPage?: number;
  limit?: number;
  onViewDetails?: (row: UnifiedDonation) => void;
  onVerifyOffline?: (row: UnifiedDonation) => void;
  onDownloadReceipt?: (row: UnifiedDonation) => void;
}

export const getDonationColumns = ({
  lang = "en",
  currentPage = 1,
  limit = 10,
  onViewDetails,
  onVerifyOffline,
  onDownloadReceipt,
}: ColumnOptions = {}) => [
  {
    name: "SNo",
    cell: (_row: UnifiedDonation, index: number) =>
      (currentPage - 1) * limit + index + 1,
    width: "50px",
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
        return <span className="font-semibold text-gray-900">{row.name.trim()}</span>;
      }
      const full = `${row.firstName || ""} ${row.lastName || ""}`.trim();
      const name = full || row.donorName;
      if (name) {
        return <span className="font-semibold text-gray-900">{name}</span>;
      }
      return <span className="text-gray-400">-</span>;
    },
    sortable: true,
    width: "130px",
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
    width: "140px",
  },
  {
    name: "Phone",
    selector: (row: UnifiedDonation) => row.phone || "-",
    cell: (row: UnifiedDonation) =>
      row.phone ? (
        <span className="text-gray-700 font-normal">{row.phone}</span>
      ) : (
        <span className="text-gray-400">-</span>
      ),
    width: "110px",
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
    width: "85px",
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
    width: "130px",
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
    width: "95px",
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
    width: "95px",
  },
  {
    name: "Status",
    cell: (row: UnifiedDonation) => {
      const statusLower = (row.status || "").toLowerCase();
      const isConfirmed =
        statusLower === "completed" ||
        statusLower === "success" ||
        statusLower === "paid" ||
        statusLower === "verified";
      const isFailed =
        statusLower === "failed" ||
        statusLower === "rejected" ||
        statusLower === "cancelled";

      let badgeClasses = "bg-[#fef3c7] text-[#92400e] border-[#fcd34d]";
      let displayLabel = "Offline";

      if (isConfirmed) {
        badgeClasses = "bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]";
        displayLabel = "Paid";
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
    width: "115px",
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
    width: "100px",
  },
  {
    name: "Actions",
    cell: (row: UnifiedDonation) => {
      const statusLower = (row.status || "").toLowerCase();
      const isOffline = row.paymentMethod?.toLowerCase() === "offline";
      const isConfirmed =
        statusLower === "completed" ||
        statusLower === "success" ||
        statusLower === "paid" ||
        statusLower === "verified";
      const isPendingOffline =
        isOffline &&
        (statusLower === "offline" ||
          statusLower === "pending" ||
          statusLower === "unverified" ||
          statusLower === "pledged");

      return (
        <div className="flex items-center gap-1.5 py-1">
          {/* View Details Action */}
          {onViewDetails && (
            <button
              type="button"
              onClick={() => onViewDetails(row)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white hover:bg-gray-100 text-gray-700 hover:text-gray-900 border border-gray-200 transition-colors cursor-pointer text-[11px] font-medium shadow-xs"
              title="View donation details"
              aria-label="View donation details"
            >
              <FaEye className="w-3 h-3 text-gray-500" />
            </button>
          )}

          {/* Verify Offline Donation Action - Rendered for pending offline donations */}
          {isPendingOffline && onVerifyOffline && (
            <button
              type="button"
              onClick={() => onVerifyOffline(row)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#00715D] hover:bg-[#005a4a] text-white transition-colors cursor-pointer text-[11px] font-semibold whitespace-nowrap shadow-xs"
              title="Verify offline payment"
              aria-label="Verify offline payment"
            >
              <FaCheck className="w-2.5 h-2.5 text-white" />
              <span>Verify</span>
            </button>
          )}

          {/* Download Receipt Action - ONLY for confirmed / completed donations */}
          {isConfirmed && onDownloadReceipt && (
            <button
              type="button"
              onClick={() => onDownloadReceipt(row)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0284c7] hover:bg-[#0369a1] text-white transition-colors cursor-pointer text-[11px] font-semibold whitespace-nowrap shadow-xs"
              title="Download 80G Receipt"
              aria-label="Download donation receipt"
            >
              <FaFileDownload className="w-2.5 h-2.5 text-white" />
              <span>Receipt</span>
            </button>
          )}
        </div>
      );
    },
    width: "130px",
  },
];


