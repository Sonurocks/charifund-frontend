import { CampaignFormValues, CategoryFormValues } from "@/src/utils/validations/FormValidation";
import { UseMutationResult } from "@tanstack/react-query";
import { Category } from "./category";

export interface Campaign {
  id: number;
  title: { en: string; hi: string };
  category: { en: string; hi: string };
  description: { en: string; hi: string };
  goalAmount: number;
  summary: { en: string; hi: string };
  organizer: string;
  raisedAmount: number;
  status: string;
  startDate: string;
  endDate: string;
  images?: { en?: (string | File)[]; hi?: (string | File)[] }; 
  existingImages?: { en?: string[]; hi?: string[] };
  location: { en: string; hi: string };
  keyPoints: { en: string[]; hi: string[] }; 
}


export interface CampaignFormProps {
  initialData?: Partial<CampaignFormValues> & Partial<Campaign>;
  onClose: () => void;
  readOnly?: boolean; 
  mode?: "add" | "edit" | "view"|"preview-edit";
  onPreview?: (values: CampaignFormValues) => void;
  createMutation?: UseMutationResult<any, unknown, any, unknown>;
  updateMutation?: UseMutationResult<any, unknown, any, unknown>;
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


export interface CampaignCardInterface {
  id: string;
  image: string;
  category: string;
  title: string;
  description: string;
  progress: number;
  raised: string;
  goal: string;
}
export interface CampaignApiResponse {
  campaigns: CampaignCardInterface[];
  limit?: number;
  page?: number;
  total?: number;
  totalPages?: number;
}

export interface CampaignCardProps {
  card?: CampaignCardInterface;
  isInView: boolean;
  hoveredCard: string | null;
  onMouseEnter: (id: string) => void;
  onMouseLeave: () => void;
  onCardClick: (id?: string) => void;
}

export interface CampaignInfoProps {
  data: any;
  allCampaigns: any[]; 
  id: string; 
  formattedDate?: string;
}

export interface CampaignType {
  id: string;
  title: string;
  description: string;
  isPending?: boolean;
  createdAt?: string;
}
