// src/hooks/useQueries.ts
import { useQuery, useMutation, useQueryClient, keepPreviousData, UseMutationOptions } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { QueryFormValues } from "@/src/utils/validations/FormValidation";
import { deleteQuery, fetchAllQueries, fetchQueryById, updateQuery } from "@/src/services/admin/queryApi";
import { useLanguageAwareQuery } from "@/src/hooks/web/useLanguageAwareQuery";

//  Fetch all queries (paginated) - language-aware
export const useFetchAllQueries = (page: number, limit: number = 10, filterValue?: string, filterField?: string) => {

  return useLanguageAwareQuery(
    ["queries", page, limit, filterValue, filterField],
    () => fetchAllQueries(page, limit, filterValue, filterField),
    {
      staleTime: 5 * 60 * 1000, 
      placeholderData: keepPreviousData

    }
  );
};

//  Fetch a single query by ID - language-aware
export const useFetchSingleQuery = (id?: string | null) => {
  return useLanguageAwareQuery(
    ["query", id],
    () => fetchQueryById(id!),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000, 
    }
  );
};

// ✅ Delete query
export const useDeleteQuery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteQuery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queries"] });
      toast.dismiss();
      toast.success("Query deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete query");
    },
  });
};

//  Update query (e.g., mark as viewed)
export const useUpdateQuery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<QueryFormValues> }) =>
      updateQuery(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queries"] });
      toast.success("Query updated");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update query");
    },
  });
};

export const useMarkQueryAsViewed = () => {
  const updateMutation = useUpdateQuery();

  const markQueryAsViewed = (query: { id: string; isViewed: boolean }, options?: UseMutationOptions<any, any, any>) => {
    if (!query.isViewed) {
      updateMutation.mutate({
        id: query.id,
        values: { isViewed: true },
      },
        options
      );
    }
  };

  return {
    markQueryAsViewed,
    isPending: updateMutation.isPending,
  };
};

export const submitQueryForm = (
  id: string,
  values: Partial<QueryFormValues>,
  updateMutation: ReturnType<typeof useUpdateQuery>,
  setSubmitting: (isSubmitting: boolean) => void,
  onClose: () => void
) => {
  toast.dismiss();
  toast.loading("Updating query...");

  updateMutation.mutate(
    { id, values },
    {
      onSuccess: () => {
        toast.dismiss();
        toast.success("Query Maked as viewed");
        setSubmitting(false);
        onClose();
      },
      onError: (err: any) => {
        toast.dismiss();
        toast.error(err?.response?.data?.message || "Failed to update query");
        setSubmitting(false);
      },
    }
  );
};
