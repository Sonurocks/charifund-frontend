import { CampaignFormValues, CategoryFormValues } from "../../utils/validations/FormValidation"
// import { Category } from "../../../types/web/category";
import { Category } from "../web/category";
export interface Campaign {
  id: number;
  title: string;
  category: string;
  description: string;
  goalAmount: number;
  summary: string;
  organizer: string;
  raisedAmount: number;
  status: string;
  startDate: string;
  endDate: string;
  images?: (string | File)[];
  imageUrl?: string[]; 
  location: string;
  existingImages:(string|File)[];
}

export interface CampaignFormProps {
  initialData?: Partial<CampaignFormValues> & Partial<Campaign>;
  onClose: () => void;
  readOnly?: boolean; 
  mode?: "add" | "edit" | "view";
  onPreview?: (values: CampaignFormValues & { keyPoints: string[] }) => void;
}

export interface CampaignColumnCallbacks {
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
  onView: (campaign: Campaign) => void;
}

export interface ActionItem<RowType> {
  label: string;
  icon: React.ReactNode;
  onClick: (row: RowType) => void;
  colorClass?: string; 
}

export interface TableRowActionsProps<RowType> {
  row: RowType;
  actions: ActionItem<RowType>[];
  className?: string;
}

export interface CategoryFormProps {
  initialData?: Partial<CategoryFormValues> & Partial<Category>;
  onClose: () => void;
  readOnly?: boolean;
  mode?: "add" | "edit" | "view";
}

export interface CategoryColumnCallbacks {
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onView: (category: Category) => void;
}
export const statusValue = [
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "Inactive", value: "inactive" },
] as const;

export interface CampaignApiResponse {
campaigns: Campaign[];
limit?:number;
page?:number;
total?:number;
totalPages?:number;
}
