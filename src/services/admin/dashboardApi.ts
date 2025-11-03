"use client";

import api from "./api";

export interface DashboardData {
  activeCampaign: number;
  totalMembers: number;
  totalFunds: number;
  pendingRequest: number;
}

export const dashboardApi = {
  getDashboardData: async (): Promise<DashboardData> => {
    try {
      console.log("Making API call to:", "/admin/dashboard/get-data");
      const response = await api.get("/admin/dashboard/get-data");
      console.log("Dashboard API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Dashboard API Error Details:", error);
      throw error;
    }
  },
};
