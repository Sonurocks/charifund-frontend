import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchPublicSponsors, fetchPublicSponsorBySlug } from "@/src/services/web/client/sponsorApi";
import { getAllSponsors, getSponsorBySlug } from "@/src/data/sponsors";
import { Sponsor } from "@/src/types/web/sponsor";

// Fetch public sponsors with seamless static fallback
export const useFetchPublicSponsors = (page: number = 1, limit: number = 20, search?: string) => {
  return useQuery({
    queryKey: ["web-sponsors", page, limit, search],
    queryFn: async () => {
      try {
        const response = await fetchPublicSponsors(page, limit, search);
        // Normalize response whether backend returns { sponsors: [...] } or array [...]
        if (response && Array.isArray((response as any).sponsors)) {
          return {
            sponsors: (response as any).sponsors as Sponsor[],
            isLiveApi: true,
          };
        }
        if (Array.isArray(response)) {
          return {
            sponsors: response as Sponsor[],
            isLiveApi: true,
          };
        }
        return {
          sponsors: getAllSponsors(),
          isLiveApi: false,
        };
      } catch (error) {
        // Fallback gracefully to static data while backend endpoint is pending
        return {
          sponsors: getAllSponsors(),
          isLiveApi: false,
        };
      }
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

// Fetch single public sponsor by slug with fallback
export const useFetchPublicSponsorBySlug = (slug?: string) => {
  return useQuery({
    queryKey: ["web-sponsor", slug],
    queryFn: async () => {
      if (!slug) return null;
      try {
        const sponsor = await fetchPublicSponsorBySlug(slug);
        if (sponsor && sponsor.name) {
          return { sponsor, isLiveApi: true };
        }
        return { sponsor: getSponsorBySlug(slug), isLiveApi: false };
      } catch (error) {
        return { sponsor: getSponsorBySlug(slug), isLiveApi: false };
      }
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
};
