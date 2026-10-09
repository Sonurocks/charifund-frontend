// src/hooks/useBanners.ts
import { fetchAllBanners } from "@/src/services/web/client/clientServices";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

//  Fetch banners with pagination and optional pageName filter
export const useFetchAllBanners = (page: number, limit: number = 10, pageName?: string) => {
    return useQuery({
        queryKey: ["banners", "web", pageName, page, limit],
        queryFn: () => fetchAllBanners(page, limit, pageName),
        placeholderData: keepPreviousData,
    });
};
