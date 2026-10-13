import api from "./api";
import { AdminSponsor, AdminSponsorListResponse } from "@/src/types/admin/sponsor";

export const fetchAllSponsors = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  searchField?: string
): Promise<AdminSponsorListResponse> => {
  let url = `/admin/sponsor/getAllSponsors?page=${page}&limit=${limit}`;
  if (search && searchField) {
    url += `&${encodeURIComponent(searchField)}=${encodeURIComponent(search)}`;
  } else if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  try {
    const { data } = await api.get(url);
    if (data && Array.isArray(data.sponsors)) {
      return data;
    }
    if (Array.isArray(data)) {
      return {
        sponsors: data,
        totalPages: 1,
        totalCount: data.length,
        page,
        limit,
      } as any;
    }
    return {
      sponsors: [],
      totalPages: 1,
      totalCount: 0,
      page,
      limit,
    } as any;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return {
        sponsors: [],
        totalPages: 1,
        totalCount: 0,
        page,
        limit,
      } as any;
    }
    throw error;
  }
};

export const fetchSponsorById = async (id: string): Promise<AdminSponsor> => {
  const { data } = await api.get(`/admin/sponsor/getSponsorById/${encodeURIComponent(id)}`);
  return data;
};

export const createSponsor = async (formData: FormData): Promise<any> => {
  const { data } = await api.post("/admin/sponsor/add-sponsor", formData);
  return data;
};

export const updateSponsor = async (id: string, formData: FormData): Promise<any> => {
  const { data } = await api.put(`/admin/sponsor/update-sponsor/${encodeURIComponent(id)}`, formData);
  return data;
};

export const deleteSponsor = async (id: string): Promise<any> => {
  const { data } = await api.delete(`/admin/sponsor/delete-sponsor/${encodeURIComponent(id)}`);
  return data;
};
