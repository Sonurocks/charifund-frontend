import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchPublicSponsors, fetchPublicSponsorBySlug } from "@/src/services/web/client/sponsorApi";
import { Sponsor } from "@/src/types/web/sponsor";

export const useFetchPublicSponsors = (page: number = 1, limit: number = 20, search?: string) => {
  return useQuery({
    queryKey: ["web-sponsors", page, limit, search],
    queryFn: async () => {
      try {
        const response = await fetchPublicSponsors(page, limit, search);
        if (response && Array.isArray((response as any).sponsors)) {
          return { sponsors: (response as any).sponsors as Sponsor[] };
        }
        if (Array.isArray(response)) {
          return { sponsors: response as Sponsor[] };
        }
        return { sponsors: [] as Sponsor[] };
      } catch {
        return { sponsors: [] as Sponsor[] };
      }
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
};

export const useFetchPublicSponsorBySlug = (slug?: string) => {
  return useQuery({
    queryKey: ["web-sponsor", slug],
    queryFn: async () => {
      if (!slug) return null;
      try {
        const sponsor = await fetchPublicSponsorBySlug(slug);
        return sponsor || null;
      } catch {
        return null;
      }
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
};
