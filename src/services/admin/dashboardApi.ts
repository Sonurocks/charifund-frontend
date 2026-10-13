"use client";

import api from "./api";

export interface DashboardData {
  activeCampaign: number;
  totalMembers: number;
  totalFunds: number;
  pendingRequest: number;
  generalFunds?: number;
  campaignFunds?: number;
  onlineFunds?: number;
  offlineFunds?: number;
  totalDonationsCount?: number;
  generalDonationsCount?: number;
  campaignDonationsCount?: number;
}

export const dashboardApi = async () => {
  const  {data}  = await api.get("/admin/dashboard/get-data");
  return data;
};
