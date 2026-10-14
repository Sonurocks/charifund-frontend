"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminGalleryImages,
  uploadGalleryImage,
  deleteGalleryImage,
} from "@/src/services/admin/galleryApi";
import { AdminGalleryListResponse } from "@/src/types/admin/gallery";

export const useAdminGallery = (page: number = 1, limit: number = 10) => {
  return useQuery<AdminGalleryListResponse>({
    queryKey: ["admin-gallery", page, limit],
    queryFn: () => fetchAdminGalleryImages(page, limit),
    staleTime: 60 * 1000,
  });
};

export const useUploadGalleryImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => uploadGalleryImage(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      queryClient.invalidateQueries({ queryKey: ["public-gallery"] });
    },
  });
};

export const useDeleteGalleryImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteGalleryImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      queryClient.invalidateQueries({ queryKey: ["public-gallery"] });
    },
  });
};
