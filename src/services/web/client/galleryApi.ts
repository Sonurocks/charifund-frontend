import api from "./api";
import { PublicGalleryResponse } from "@/src/types/web/gallery";

/**
 * Fetch all public gallery images for footer scroller & gallery view
 */
export const fetchPublicGalleryImages = async (): Promise<PublicGalleryResponse> => {
  try {
    const { data } = await api.get<PublicGalleryResponse>("/web/gallery/getAllImages");
    if (data && Array.isArray(data.images)) {
      return data;
    }
    if (Array.isArray(data)) {
      return {
        total: (data as any[]).length,
        page: 1,
        limit: (data as any[]).length,
        totalPages: 1,
        images: data,
      };
    }
    return {
      total: 0,
      page: 1,
      limit: 100,
      totalPages: 0,
      images: [],
    };
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return {
        total: 0,
        page: 1,
        limit: 100,
        totalPages: 0,
        images: [],
      };
    }
    throw error;
  }
};
