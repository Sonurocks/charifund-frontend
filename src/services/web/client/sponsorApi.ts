import api from "./api";
import { Sponsor, SponsorListResponse } from "@/src/types/web/sponsor";

export const fetchPublicSponsors = async (
  page: number = 1,
  limit: number = 20,
  search?: string
): Promise<SponsorListResponse> => {
  let url = `/web/sponsor/getAllSponsors?page=${page}&limit=${limit}`;
  if (search && search.trim() !== "") {
    url += `&search=${encodeURIComponent(search)}`;
  }
  try {
    const { data } = await api.get(url);
    return data;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return { sponsors: [], totalPages: 1, totalCount: 0, page, limit } as any;
    }
    throw error;
  }
};

export const fetchPublicSponsorBySlug = async (slug: string): Promise<Sponsor> => {
  try {
    const { data } = await api.get(`/web/sponsor/getSponsorBySlug/${encodeURIComponent(slug)}`);
    return data?.sponsor || data;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return null as any;
    }
    throw error;
  }
};
