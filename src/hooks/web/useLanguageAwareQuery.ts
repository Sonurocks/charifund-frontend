import { useQuery, useQueryClient, UseQueryOptions, QueryKey } from "@tanstack/react-query";
import { useLanguage } from "@/src/contexts/LanguageContext";

/**
 * Custom hook for language-aware API queries
 * Automatically refetches data when language changes
 */
export const useLanguageAwareQuery = <
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData
>(
  queryKey: QueryKey,
  queryFn: () => Promise<TQueryFnData>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, QueryKey>, "queryKey" | "queryFn">
) => {
  const { currentLanguage } = useLanguage();
  const queryClient = useQueryClient();

  // Include language in query key so data refetches when language changes
  const languageAwareQueryKey: QueryKey = [...queryKey, currentLanguage];

  return useQuery<TQueryFnData, TError, TData>({
    queryKey: languageAwareQueryKey,
    queryFn,
    ...options, // ✅ forward all other options (staleTime, placeholderData, etc.)
  });
};
