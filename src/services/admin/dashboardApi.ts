"use client";

import api from "./api";

export interface DashboardData {
  activeCampaign: number;
  totalMembers: number;
  totalFunds: number;
  pendingRequest: number;
}

export const dashboardApi = async () => {
  console.log("che809")
  const  {data}  = await api.get("/admin/dashboard/get-data");
  console.log("che", data)
  return data;
};
