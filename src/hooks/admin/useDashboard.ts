"use client";

import { useQuery } from "@tanstack/react-query";
import {
  dashboardApi,
  fetchCampaignDistribution,
  fetchMonthlyFunds,
} from "@/src/services/admin/dashboardApi";

export const useFetchDashboardData = () => {
  return useQuery({
    queryKey: ["dashboard-data"],
    queryFn: () => dashboardApi(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFetchCampaignDistribution = () => {
  return useQuery({
    queryKey: ["dashboard", "campaign-distribution"],
    queryFn: () => fetchCampaignDistribution(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFetchMonthlyFunds = (year?: number) => {
  return useQuery({
    queryKey: ["dashboard", "monthly-funds", year ?? "current"],
    queryFn: () => fetchMonthlyFunds(year),
    staleTime: 5 * 60 * 1000,
  });
};