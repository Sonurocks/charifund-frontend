import { useQuery } from "@tanstack/react-query";
import { fetchDonations } from "../../services/admin/donationApi";
import { DonationFilterParams, DonationListResponse } from "../../types/admin/donation";

export const useFetchDonations = (params: DonationFilterParams) => {
  return useQuery<DonationListResponse, Error>({
    queryKey: [
      "unified-donations",
      params.page,
      params.limit,
      params.search,
      params.type,
      params.paymentMethod,
      params.campaignId,
      params.startDate,
      params.endDate,
    ],
    queryFn: () => fetchDonations(params),
    placeholderData: (previousData) => previousData,
    staleTime: 60 * 1000,
  });
};
