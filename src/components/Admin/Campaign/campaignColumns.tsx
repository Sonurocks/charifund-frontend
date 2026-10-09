
"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Campaign, CampaignColumnCallbacks } from "@/src/types/admin/campaign";

//  Dynamically import TableRowActions
const TableRowActions = dynamic(() => import("./CampaignActions"), {
  loading: () => <span className="text-gray-400 text-xs">Loading...</span>,
  ssr: false,
});

//  Dynamically import icons from react-icons/fa
const FaEye = dynamic(() => import("react-icons/fa").then(mod => mod.FaEye), {
  ssr: false,
});
const FaEdit = dynamic(() => import("react-icons/fa").then(mod => mod.FaEdit), {
  ssr: false,
});
const FaTrash = dynamic(() => import("react-icons/fa").then(mod => mod.FaTrash), {
  ssr: false,
});
const FaUsers = dynamic(() => import("react-icons/fa").then(mod => mod.FaUsers), {
  ssr: false,
});

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
    selector: (row: Campaign) => `₹${row.goalAmount.toLocaleString() ?? "-"}`,
  },
  {
    name: "Raised",
    selector: (row: Campaign) => `₹${row.raisedAmount.toLocaleString() ?? "-"}`,
  },
  { name: "Status", selector: (row: Campaign) => row.status },
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
