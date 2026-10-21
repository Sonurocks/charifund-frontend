// src/hooks/useMembers.ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchAllMembers, fetchMemberById } from "@/src/services/web/client/clientServices";


// Fetch members with pagination
export const useFetchAllMembers = (
  page: number,
  limit: number = 10,
  options?: { enabled?: boolean; [key: string]: any }
) => {
  return useQuery({
    queryKey: ["members", page, limit],
    queryFn: () => fetchAllMembers(page, limit),
    placeholderData: keepPreviousData,
    ...options,
  });
};

// Fetch single member
export const useFetchSingleMember = (id?: string) => {
  return useQuery({
    queryKey: ["member", id],
    queryFn: () => fetchMemberById(id!),
    enabled: !!id,
    retry: 2,
    retryDelay: 1000,
  });
};
