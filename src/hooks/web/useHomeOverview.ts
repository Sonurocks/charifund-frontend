import { useQuery } from "@tanstack/react-query";
import { fetchHomeOverview } from "@/src/services/web/client/clientServices";
import { useTranslation } from "react-i18next";

/**
 * Hook to retrieve bundled homepage overview data.
 * Returns { banners, campaigns, sponsors, feedbacks, blogs, members, gallery }
 */
export const useHomeOverview = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  return useQuery({
    queryKey: ["home-overview", currentLang],
    queryFn: async () => {
      const response = await fetchHomeOverview();
      return response?.data || response;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
