import api from "./api";
import { Sponsor, SponsorListResponse } from "@/src/types/web/sponsor";

// Fetch all public sponsors with optional pagination and search
export const fetchPublicSponsors = async (
  page: number = 1,
  limit: number = 20,
  search?: string
): Promise<SponsorListResponse> => {
  let url = `/web/sponsor/getAllSponsors?page=${page}&limit=${limit}`;
  if (search && search.trim() !== "") {
    url += `&search=${encodeURIComponent(search)}`;
  }
  const { data } = await api.get(url);
  return data;
};

// Fetch single public sponsor by slug
export const fetchPublicSponsorBySlug = async (slug: string): Promise<Sponsor> => {
  const { data } = await api.get(`/web/sponsor/getSponsorBySlug/${slug}`);
  return data;
};
