"use client";

import { Campaign, CampaignColumnCallbacks } from "@/src/types/admin/campaign";
import { FaEdit, FaEye, FaTrash, FaUsers } from "react-icons/fa";
import TableRowActions from "./CampaignActions";

export const getCampaignColumns = ({
  onEdit,
  onDelete,
  onView,
  onDonors,
}: CampaignColumnCallbacks) => [
  { name: "SNo", cell: (_row: Campaign, index: number) => index + 1, width: "80px" },
  { name: "Title", selector: (row: Campaign) => (row.title as any)?.en ?? row.title ?? "-", sortable: true },
  { name: "Organizer", selector: (row: Campaign) => row.organizer ?? "-" },
  { name: "Category", selector: (row: Campaign) => (row.category as any)?.name?.en || (row.category as any)?.en || row.category || "-" },
  {
    name: "Goal",
    selector: (row: Campaign) => `₹${row.goalAmount?.toLocaleString() ?? "-"}`,
  },
  {
    name: "Raised",
    selector: (row: Campaign) => `₹${row.raisedAmount?.toLocaleString() ?? "-"}`,
  },
  {
    name: "Status",
    selector: (row: Campaign) => row.status,
    cell: (row: Campaign) => {
      const s = row.status?.toLowerCase().trim();
      const badgeClass =
        s === "completed"
          ? "bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]"
          : s === "active"
          ? "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]"
          : "bg-[#fef2f2] text-[#991b1b] border-[#fecaca]";
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${badgeClass} whitespace-nowrap shadow-2xs`}
        >
          {row.status || "-"}
        </span>
      );
    },
    sortable: true,
  },
  {
    name: "Actions",
    cell: (row: Campaign) => (
      <TableRowActions
        row={row as any}
        actions={[
          {
            label: "View Donors",
            icon: <FaUsers />,
            onClick: onDonors,
            colorClass: "text-purple-500 hover:text-purple-700",
          },
          {
            label: "View Campaign",
            icon: <FaEye />,
            onClick: onView,
            colorClass: "text-blue-500 hover:text-blue-700",
          },
          {
            label: "Edit Campaign",
            icon: <FaEdit />,
            onClick: onEdit,
            colorClass: "text-green-500 hover:text-green-700",
          },
          {
            label: "Delete Campaign",
            icon: <FaTrash />,
            onClick: onDelete,
            colorClass: "text-red-500 hover:text-red-700",
          },
        ].filter((action) => action.onClick !== undefined) as any}
      />
    ),
  },
];
