
import { useLanguageAwareQuery } from "@/src/hooks/web/useLanguageAwareQuery";
import { fetchAllEvents, fetchEventById } from "@/src/services/web";

export const useFetchAllEvent = (page: number, limit: number = 10,search?:string) => {
  return useLanguageAwareQuery(
    ["event", page, limit,search], 
    () => fetchAllEvents(page, limit,search),
    {
      staleTime: 5 * 60 * 1000, 
    }
  );
};

export const useFetchSingleEvent = (id?: string,options?: { enabled?: boolean }) => {
  return useLanguageAwareQuery(
    ["event", id],
    () => fetchEventById(id!),
    {
      enabled: options?.enabled ?? !!id,
      staleTime: 5 * 60 * 1000, 
    }
  );
};

