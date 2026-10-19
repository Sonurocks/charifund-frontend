import api from "./api";
import { AdminGalleryListResponse, GalleryImage } from "@/src/types/admin/gallery";

/**
 * Fetch paginated gallery images for admin
 */
export const fetchAdminGalleryImages = async (
  page: number = 1,
  limit: number = 10
): Promise<AdminGalleryListResponse> => {
  try {
    const { data } = await api.get<AdminGalleryListResponse>(
      `/admin/gallery/getAllImages?page=${page}&limit=${limit}`
    );
    if (data && Array.isArray(data.images)) {
      return data;
    }
    if (Array.isArray(data)) {
      return {
        total: (data as any[]).length,
        page,
        limit,
        totalPages: Math.ceil((data as any[]).length / limit) || 1,
        images: data,
      };
    }
    return {
      total: 0,
      page,
      limit,
      totalPages: 0,
      images: [],
    };
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return {
        total: 0,
        page,
        limit,
        totalPages: 0,
        images: [],
      };
    }
    throw error;
  }
};

/**
 * Upload an image to the gallery
 */
export const uploadGalleryImage = async (formData: FormData): Promise<{ success: boolean; image: GalleryImage; message?: string }> => {
  const { data } = await api.post("/admin/gallery/add-image", formData);
  return data;
};

/**
 * Delete a gallery image by ID
 */
export const deleteGalleryImage = async (id: string): Promise<{ success: boolean; message?: string }> => {
  const { data } = await api.delete(`/admin/gallery/delete/${encodeURIComponent(id)}`);
  return data;
};
