
import { CampaignFormValues } from "@/src/utils/validations/FormValidation";
import api from "./api";

// ✅ Create a campaign
export const createCampaign = async (campaign: CampaignFormValues) => {
  const { data } = await api.post("/admin/campaign/add-campaign", campaign);
  return data;
};

// Get all campaigns with pagination
export const fetchAllCampaigns = async (
  page: number = 1,
  limit: number = 2,
  search?: string,
  searchField?: string
) => {
  let url = `/admin/campaign/getAllCampaigns?page=${page}&limit=${limit}`;
  if (search && searchField) {
    url += `&${encodeURIComponent(searchField)}=${encodeURIComponent(search)}`
  } else if (search) {
    url += `&search=${encodeURIComponent(search)}`
  }

  const { data } = await api.get(url);
  return data;
};


// Get single campaign by ID
export const fetchCampaignById = async (id: string) => {
  const { data } = await api.get(`/admin/campaign/getCampaignById/${id}`);
  return data;
};

// Update campaign
export const updateCampaign = async (id: string, campaign: Partial<CampaignFormValues>) => {
  const { data } = await api.put(`/admin/campaign/update-campaign/${id}`, campaign);
  return data;
};

// Delete campaign
export const deleteSingleCampaign = async (id: string) => {
  const { data } = await api.delete(`/admin/campaign/delete-campaign/${id}`);
  return data;
};
