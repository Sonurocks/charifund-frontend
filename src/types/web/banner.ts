import { BannerFormValues } from "@/src/utils/validations/FormValidation";
import { UseMutationResult } from "@tanstack/react-query";

export type BannerSearchField = "title" | "subtitle"|"priority"; 

// Banner - used in <BannerTable />
export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  priority: number;
  image: string;
  link?: string;
}
// Banner Form Props - used in <BannerForm />
export interface BannerFormProps {
  initialData?: Partial<BannerFormValues> & Partial<Banner>;
  onClose: () => void;
  mode?: "add" | "edit"| "view"|"preview-edit"; 
  onPreview?: (values: BannerFormValues) => void;
  createMutation: UseMutationResult<any, Error, BannerFormValues, unknown>;
  updateMutation: UseMutationResult<any, Error, { id: string; values: BannerFormValues }, unknown>;
}
// Banner Column Callbacks - used in getBannerColumns.ts
export interface BannerColumnCallbacks {
  onEdit: (banner: Banner) => void;
  onDelete: (banner: Banner) => void;
  onView?: (banner: Banner) => void; 
}


