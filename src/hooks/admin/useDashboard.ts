"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/src/services/admin/dashboardApi";
import { DashboardData } from "@/src/types/admin";

export const useFetchDashboardData = () => {
  return useQuery<DashboardData>({
    queryKey: ["dashboard-data"],
    queryFn: dashboardApi.getDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
