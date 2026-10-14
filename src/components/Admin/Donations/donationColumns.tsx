import React from "react";
import { UnifiedDonation } from "@/src/types/admin/donation";

interface ColumnOptions {
  lang?: string;
  currentPage?: number;
  limit?: number;
}

export const getDonationColumns = ({
  lang = "en",
  currentPage = 1,
  limit = 10,
}: ColumnOptions = {}) => [
  {
    name: "SNo",
    cell: (_row: UnifiedDonation, index: number) =>
      (currentPage - 1) * limit + index + 1,
    width: "70px",
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
        return <span className="font-medium text-gray-900">{row.name.trim()}</span>;
      }
      const full = `${row.firstName || ""} ${row.lastName || ""}`.trim();
      const name = full || row.donorName;
      if (name) {
        return <span className="font-medium text-gray-900">{name}</span>;
      }
      return <span className="text-gray-400">-</span>;
    },
    sortable: true,
    width: "140px",
  },
  {
    name: "Email",
    selector: (row: UnifiedDonation) => row.email || "-",
    cell: (row: UnifiedDonation) =>
      row.email ? (
        <span className="text-gray-700 truncate" title={row.email}>
          {row.email}
        </span>
      ) : (
        <span className="text-gray-400">-</span>
      ),
    width: "160px",
  },
  {
    name: "Phone",
    selector: (row: UnifiedDonation) => row.phone || "-",
    cell: (row: UnifiedDonation) =>
      row.phone ? (
        <span className="text-gray-700">{row.phone}</span>
      ) : (
        <span className="text-gray-400">-</span>
      ),
    width: "130px",
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
            isGeneral ? "text-purple-700" : "text-blue-700"
          }`}
        >
          {isGeneral ? "General" : "Campaign"}
        </span>
      );
    },
    width: "110px",
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
    width: "160px",
  },
  {
    name: "Method",
    cell: (row: UnifiedDonation) => {
      const isOnline = row.paymentMethod?.toLowerCase() === "online";
      return (
        <span
          className={`text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
            isOnline ? "text-emerald-700" : "text-amber-700"
          }`}
        >
          {row.paymentMethod ? row.paymentMethod.toUpperCase() : "-"}
        </span>
      );
    },
    width: "100px",
  },
  {
    name: "Amount",
    selector: (row: UnifiedDonation) => row.amount,
    cell: (row: UnifiedDonation) => (
      <span className="font-bold text-gray-900">
        ₹{Number(row.amount || 0).toLocaleString("en-IN")}
      </span>
    ),
    sortable: true,
    width: "110px",
  },
  {
    name: "Status",
    cell: (row: UnifiedDonation) => {
      const statusLower = (row.status || "").toLowerCase();
      let badgeStyle = "bg-gray-100 text-gray-700 border-gray-300";
      if (
        statusLower === "completed" ||
        statusLower === "success" ||
        statusLower === "paid"
      ) {
        badgeStyle = "bg-green-100 text-green-700 border-green-200";
      } else if (statusLower === "offline") {
        badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
      } else if (statusLower === "pending") {
        badgeStyle = "bg-yellow-100 text-yellow-800 border-yellow-200";
      } else if (statusLower === "failed") {
        badgeStyle = "bg-red-100 text-red-700 border-red-200";
      }

      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${badgeStyle}`}
        >
          {row.status || "-"}
        </span>
      );
    },
    width: "110px",
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
    width: "120px",
  },
];
