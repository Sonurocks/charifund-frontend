import React from "react";
import { CampaignDonor } from "@/src/types/admin/donor";

export const donorColumns = [
  { name: "SNo", cell: (_row: CampaignDonor, index: number) => index + 1, width: "70px" },
  { name: "Donor Name", selector: (row: CampaignDonor) => `${row.firstName || ""} ${row.lastName || ""}`.trim() || "-", sortable: true },
  { name: "Email", selector: (row: CampaignDonor) => row.email || "-" },
  { name: "Phone", selector: (row: CampaignDonor) => row.phone || "-" },
  { name: "Address", selector: (row: CampaignDonor) => row.address || "-" },
  { name: "Amount", selector: (row: CampaignDonor) => `₹${Number(row.amount).toLocaleString() || 0}`, sortable: true },
  { name: "Method", selector: (row: CampaignDonor) => (row.paymentMethod || "-").toUpperCase() },
  { name: "Status", selector: (row: CampaignDonor) => row.status || "-" },
  {
    name: "Date",
    selector: (row: CampaignDonor) => {
      if (!row.createdAt) return "-";
      return new Date(row.createdAt).toLocaleDateString();
    },
    sortable: true
  },
];
