export interface GalleryImage {
  id?: string;
  _id?: string;
  imageUrl: string;
  altText?: string;
  public_id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminGalleryListResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  images: GalleryImage[];
}

export interface UploadGalleryImagePayload {
  image: File;
  altText?: string;
}
