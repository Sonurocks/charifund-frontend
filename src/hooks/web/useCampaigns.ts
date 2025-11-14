
import { useLanguageAwareQuery } from "@/src/hooks/web/useLanguageAwareQuery";
import { fetchAllCampaigns, fetchCampaignById } from "@/src/services/web";


export const useFetchAllCampaigns = (page: number, limit: number = 10,search?:string) => {
  return useLanguageAwareQuery(
    ["campaigns", page, limit,search], 
    () => fetchAllCampaigns(page, limit,search),
    {
      staleTime: 5 * 60 * 1000, 
    }
  );
};


export const useFetchSingleCampaign = (id?: string,options?: { enabled?: boolean }) => {
    console.log(id)
  return useLanguageAwareQuery(
    ["campaign", id],
    () => fetchCampaignById(id!),
    {
      enabled: options?.enabled ?? !!id,
      staleTime: 5 * 60 * 1000, 
    }
  );
};
