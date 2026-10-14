export interface PublicGalleryImage {
  id?: string;
  _id?: string;
  imageUrl: string;
  altText?: string;
  createdAt?: string;
}

export interface PublicGalleryResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  images: PublicGalleryImage[];
}
