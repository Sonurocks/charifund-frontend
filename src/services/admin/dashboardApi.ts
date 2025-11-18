"use client";

import api from "./api";

export interface DashboardData {
  activeCampaign: number;
  totalMembers: number;
  totalFunds: number;
  pendingRequest: number;
}

export const dashboardApi = async () => {
  const  {data}  = await api.get("/admin/dashboard/get-data");
  return data;
};
