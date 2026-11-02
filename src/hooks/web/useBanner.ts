// src/hooks/web/useBanner.ts
import { fetchAllBanners } from "@/src/services/web/client/clientServices";
import { useQuery } from "@tanstack/react-query";

// Fetch banners with pagination and optional pageName filter
export const useFetchAllBanners = (
  page: number = 1,
  limit: number = 10,
  pageName?: string,
  options?: { enabled?: boolean; [key: string]: any }
) => {
    return useQuery({
        queryKey: ["banners", "web", pageName, page, limit],
        queryFn: () => fetchAllBanners(page, limit, pageName),
        enabled: options?.enabled !== undefined ? options.enabled : Boolean(pageName),
        staleTime: 1000 * 60 * 2, // 2 minutes caching for smooth transitions
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        ...options,
    });
};

