"use client";

import api from "./api";

export interface DashboardData {
  activeCampaign?: number;
  liveEvents?: number;
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
  offlineDonationsCount?: number;
  pendingDonationsCount?: number;
}

export const dashboardApi = async (): Promise<DashboardData> => {
  const { data } = await api.get("/admin/dashboard/get-data");
  return data;
};

// Campaign Distribution types
export interface CampaignDistributionItem {
  campaignId: string | null;
  name: string;
  value: number;
  donorCount: number;
}

export interface CampaignDistributionResponse {
  distribution: CampaignDistributionItem[];
  total: number;
}

// Monthly Funds types
export interface MonthlyFundItem {
  month: string;
  monthNumber: number;
  funds: number;
  count: number;
}

export interface MonthlyFundsResponse {
  year: number;
  monthly: MonthlyFundItem[];
  totalYearFunds: number;
}

// Fetch Campaign Distribution
export const fetchCampaignDistribution = async (): Promise<CampaignDistributionResponse> => {
  const { data } = await api.get("/admin/dashboard/campaign-distribution");
  return data;
};

// Fetch Monthly Funds with optional year query param
export const fetchMonthlyFunds = async (year?: number): Promise<MonthlyFundsResponse> => {
  const url = year ? `/admin/dashboard/monthly-funds?year=${year}` : "/admin/dashboard/monthly-funds";
  const { data } = await api.get(url);
  return data;
};
