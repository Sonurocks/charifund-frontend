// src/hooks/useCategory.ts
import { createCategory, deleteCategory, fetchCategory, fetchCategoryById, updateCategory } from "@/src/services/admin/categoryApi";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import toast from "react-hot-toast";


// ======================= Fetch Categories ======================= //
export const useFetchCategory = (page?: number, limit?: number, searchedData?: string, searchField?: string) => {
  return useQuery({
    queryKey: ["categories", page, limit, searchedData, searchField],
    queryFn: () => fetchCategory(page, limit, searchedData, searchField),
    placeholderData: keepPreviousData

  });
};

export const useFetchCategoryById = (id: string) => {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => fetchCategoryById(id),
    enabled: !!id,
  });
};

// ======================= Create Category ======================= //
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response.data.message || "Failed to create category");
    },
  });
};

// ======================= Update Category ======================= //
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string } }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update category");
    },
  });

};

// ======================= Delete Category ======================= //
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.dismiss()
      toast.success("Category deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response.data.message || "Failed to delete category");
    },
  });
};
