import { useQuery } from "@tanstack/react-query";
import { fetchCampaignDonors } from "../../services/admin/donorApi";

export const useFetchCampaignDonors = (
  campaignId: string,
  page: number,
  limit: number,
  search?: string
) => {
  return useQuery({
    queryKey: ["campaign-donors", campaignId, page, limit, search],
    queryFn: () => fetchCampaignDonors(campaignId, page, limit, search),
    enabled: !!campaignId,
    // Add keepPreviousData to keep the list stable during pagination, adjust as per react-query version
    placeholderData: (previousData) => previousData,
  });
};
