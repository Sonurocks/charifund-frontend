import { UseMutationResult } from "@tanstack/react-query";
import { SponsorFormValues } from "@/src/utils/validations/FormValidation";

export type SponsorSearchField = "name" | "category" | "location";

export interface AdminSponsor {
  id: string;
  slug: string;
  name: {
    en: string;
    hi: string;
  } | string;
  category: {
    en: string;
    hi: string;
  } | string;
  location?: {
    en: string;
    hi: string;
  } | string;
  shortDescription: {
    en: string;
    hi: string;
  } | string;
  description: {
    en: string;
    hi: string;
  } | string;
  website?: string | null;
  logo: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminSponsorListResponse {
  sponsors: AdminSponsor[];
  totalPages?: number;
  totalSponsors?: number;
  currentPage?: number;
}

export interface SponsorFormProps {
  initialData?: any;
  onClose: () => void;
  mode?: "add" | "edit" | "view" | "preview-edit";
  onPreview?: (data: SponsorFormValues) => void;
  createMutation?: UseMutationResult<any, Error, FormData, unknown>;
  updateMutation?: UseMutationResult<any, Error, { id: string; values: FormData }, unknown>;
}

export interface SponsorColumnCallbacks {
  onEdit: (sponsor: AdminSponsor) => void;
  onDelete: (sponsor: AdminSponsor) => void;
  onView: (sponsor: AdminSponsor) => void;
}
