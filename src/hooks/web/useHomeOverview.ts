import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchHomeOverview } from "@/src/services/web/client/clientServices";
import { useTranslation } from "react-i18next";

/**
 * Hook to retrieve bundled homepage overview data.
 * Primes individual query caches so subcomponents don't make separate network requests.
 */
export const useHomeOverview = () => {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  return useQuery({
    queryKey: ["home-overview", currentLang],
    queryFn: async () => {
      const response = await fetchHomeOverview();
      const overview = response?.data || response;

      if (overview) {
        // 1. Prime Banners cache
        if (overview.banners) {
          queryClient.setQueryData(
            ["banners", "web", "Home", 1, 10],
            { banners: overview.banners, total: overview.banners.length }
          );
        }

        // 2. Prime Sponsors cache
        if (overview.sponsors) {
          queryClient.setQueryData(
            ["web-sponsors", 1, 20, undefined],
            { sponsors: overview.sponsors }
          );
        }

        // 3. Prime Campaigns cache (language-aware)
        if (overview.campaigns) {
          queryClient.setQueryData(
            ["campaigns", 1, 8, "All", currentLang],
            { campaigns: overview.campaigns, total: overview.campaigns.length }
          );
        }

        // 4. Prime Members / Volunteers cache
        if (overview.members) {
          queryClient.setQueryData(
            ["members", 1, 4],
            { members: overview.members, total: overview.members.length }
          );
        }

        // 5. Prime Feedback cache
        if (overview.feedbacks) {
          queryClient.setQueryData(["feedback"], overview.feedbacks);
        }

        // 6. Prime Blogs cache (language-aware)
        if (overview.blogs) {
          queryClient.setQueryData(
            ["blogs", 1, 3, "All", currentLang],
            { blogs: overview.blogs, total: overview.blogs.length }
          );
        }

        // 7. Prime Public Gallery cache
        if (overview.gallery) {
          queryClient.setQueryData(
            ["public-gallery"],
            { images: overview.gallery, total: overview.gallery.length }
          );
        }
      }

      return overview;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
