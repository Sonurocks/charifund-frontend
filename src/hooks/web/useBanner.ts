// src/hooks/useBanners.ts
import { fetchAllBanners } from "@/src/services/web";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

//  Fetch banners with pagination
export const useFetchAllBanners = (page: number, limit: number = 10) => {
    return useQuery({
        queryKey: ["banners", page, limit],
        queryFn: () => fetchAllBanners(page, limit),
        placeholderData: keepPreviousData,

    });
};
