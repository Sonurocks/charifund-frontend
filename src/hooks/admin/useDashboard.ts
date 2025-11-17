"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/src/services/admin/dashboardApi";


export const useFetchDashboardData = () => {
  return useQuery({
    queryKey: ["dashboard-data"],
    queryFn: () => dashboardApi(),
    staleTime: 5 * 60 * 1000,
  });
};