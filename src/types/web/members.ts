import { UseMutationResult } from "@tanstack/react-query";
import { MemberFormValues } from "../../utils/validations/FormValidation";

// 🧩 Member model interface
export interface Member {
  id: string;
  name: {
    en: string;
    hi: string;
  };
  position: {
    en: string;
    hi: string;
  };
  title?: {
    en: string;
    hi: string;
  };
  description: {
    en: string;
    hi: string;
  };
  about?: {
    en: string;
    hi: string;
  };
  keyPoints: {
    en: string[];
    hi: string[];
  };
  image?: string;
  facebookUrl?: string;
  vimeoUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  linkedInUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  img: string;
  role: string;
}

// 🧩 Props for MemberForm component
export interface MemberFormProps {
  initialData?: Partial<MemberFormValues> & Partial<Member>;
  onClose: () => void;
  mode?: "add" | "edit" | "view"|"preview-edit";
  onPreview?: (data: MemberFormValues) => void;
  createMutation: UseMutationResult<any, Error, MemberFormValues, unknown>;
  updateMutation: UseMutationResult<any, Error, { id: string; values: MemberFormValues }, unknown>;
}

// 🧩 Callbacks for table column actions (edit/delete)
export interface MemberColumnCallbacks {
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
  onView?: (member: Member) => void; // optional if you don’t support view mode
}


export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  position?: string;
  image?: string;
  imageUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  linkedInUrl?: string;
  behanceUrl?: string;
  vimeoUrl?: string;
  delay?: number;
}

export interface VolunteerGridProps {
  members: TeamMember[];
}

export interface VolunteerCardProps {
  member: TeamMember;
  idx: number;
}