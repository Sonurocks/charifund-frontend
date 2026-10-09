import api from "./api";
import { CampaignDonorResponse } from "../../types/admin/donor";

export const fetchCampaignDonors = async (
  campaignId: string,
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<CampaignDonorResponse> => {
  const searchQuery = search ? `&search=${encodeURIComponent(search)}` : "";
  const { data } = await api.get<CampaignDonorResponse>(
    `/admin/donation/campaign/${campaignId}?page=${page}&limit=${limit}${searchQuery}`
  );
  return data;
};

export const exportCampaignDonorsCsv = async (campaignId: string, campaignTitle: string) => {
  const response = await api.get(`/admin/donation/campaign/${campaignId}/export`, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], { type: "text/csv" });
  const objectUrl = window.URL.createObjectURL(blob);
  
  const safeTitle = campaignTitle ? campaignTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() : campaignId;
  const filename = `${safeTitle}_donors.csv`;

  const link = document.createElement("a");
  link.href = objectUrl;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(objectUrl);
};
