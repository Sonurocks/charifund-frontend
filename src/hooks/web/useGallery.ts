"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPublicGalleryImages } from "@/src/services/web/client/galleryApi";
import { PublicGalleryResponse } from "@/src/types/web/gallery";

export const usePublicGallery = (options?: { enabled?: boolean; [key: string]: any }) => {
  return useQuery<PublicGalleryResponse>({
    queryKey: ["public-gallery"],
    queryFn: fetchPublicGalleryImages,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false,
    ...options,
  });
};
