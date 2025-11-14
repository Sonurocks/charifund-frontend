import { BannerFormValues } from "@/src/utils/validations/FormValidation";
import { UseMutationResult } from "@tanstack/react-query";


// Banner - used in <BannerTable />
export interface Banner {
    id?: string;
    title: string;
    subtitle: string;
    image: string;
    priority: number;
}
// Banner Form Props - used in <BannerForm />
export interface BannerFormProps {
  initialData?: Partial<BannerFormValues> & Partial<Banner>;
  onClose: () => void;
  mode?: "add" | "edit"|"view"|"preview-edit"; 
  createMutation: UseMutationResult<any, Error, BannerFormValues, unknown>;
  updateMutation: UseMutationResult<any, Error, { id: string; values: BannerFormValues }, unknown>;
  onPreview?: (values: BannerFormValues) => void
}
// Banner Column Callbacks - used in getBannerColumns.ts
export interface BannerColumnCallbacks {
  onEdit: (banner: Banner) => void;
  onDelete: (banner: Banner) => void;
  onView?: (banner: Banner) => void; 
}

export type BannerSearchField = "title" | "subtitle" | "priority";
