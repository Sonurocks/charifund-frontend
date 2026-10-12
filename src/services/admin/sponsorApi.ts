import api from "./api";
import { AdminSponsor, AdminSponsorListResponse } from "@/src/types/admin/sponsor";

// Get all sponsors with pagination and search
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
  const { data } = await api.get(url);
  return data;
};

// Get single sponsor by ID
export const fetchSponsorById = async (id: string): Promise<AdminSponsor> => {
  const { data } = await api.get(`/admin/sponsor/getSponsorById/${id}`);
  return data;
};

// Create a new sponsor (multipart FormData with logo file)
export const createSponsor = async (formData: FormData): Promise<any> => {
  const { data } = await api.post("/admin/sponsor/add-sponsor", formData);
  return data;
};

// Update an existing sponsor
export const updateSponsor = async (id: string, formData: FormData): Promise<any> => {
  const { data } = await api.put(`/admin/sponsor/update-sponsor/${id}`, formData);
  return data;
};

// Delete a sponsor by ID
export const deleteSponsor = async (id: string): Promise<any> => {
  const { data } = await api.delete(`/admin/sponsor/delete-sponsor/${id}`);
  return data;
};
