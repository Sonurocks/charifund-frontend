// src/services/bannerApi.ts
import { BannerFormValues } from "@/src/utils/validations/FormValidation";
import api from "./api";



//  Create a banner
export const createBanner = async (banner: BannerFormValues) => {
  const { data } = await api.post("/admin/banner/add-banner", banner);
  return data;
};


export const fetchAllBanners = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  searchField?: string
) => {
  let url = `/admin/banner/getAllBanners?page=${page}&limit=${limit}`;
  if (search && searchField) {
    url += `&${encodeURIComponent(searchField)}=${encodeURIComponent(search)}`;
  } else if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  const { data } = await api.get(url);
  return data;
};




//  Get single banner by ID
export const fetchBannerById = async (id: string) => {
  const { data } = await api.get(`/admin/banner/getBannerById/${id}`);
  return data;
};

//  Update banner
export const updateBanner = async (id: string, banner: Partial<BannerFormValues>) => {
  const { data } = await api.put(`/admin/banner/update-banner/${id}`, banner);
  return data;
};

//  Delete banner
export const deleteBanner = async (id: string) => {
  const { data } = await api.delete(`/admin/banner/delete-banner/${id}`);
  return data;
};
