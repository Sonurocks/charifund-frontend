import { BannerFormValues, BlogFormValues, CampaignFormValues, EventFormValues, MemberFormValues } from "@/src/utils/validations/FormValidation";
import { Comment } from "../web/comments";
import { JSX } from "react";

export interface AdminSideBarTabProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export interface BannerPreviewProps {
  data: BannerFormValues;
  onBack: () => void;
  onSubmit: () => void;
  mode?: "add" | "edit" | "view" | "preview-edit";
  showButtons?: boolean
  createMutation?: UseMutationResult<any, Error, any>;
  updateMutation?: UseMutationResult<any, Error, any>;
}

export interface EventPreviewProps {
  data: EventFormValues & { createdAt?: string; existingImages?: string[], organizer?: string, raisedAmount?: number };
  onSubmit: () => void;
  onBack: () => void;
  mode?: "add" | "edit" | "view" | "preview-edit";
  showButton?: boolean;
  createMutation?: UseMutationResult<any, Error, any>;
  updateMutation?: UseMutationResult<any, Error, any>;
}
export interface MemberPreviewProps {
  data: MemberFormValues & { createdAt?: string };
  onSubmit: () => void;
  onBack: () => void;
  mode?: "add" | "edit" | "view" | "preview-edit";
  showButton?: boolean;
  createMutation?: UseMutationResult<any, Error, any>;
  updateMutation?: UseMutationResult<any, Error, any>;
}

export interface BannerColumnCallbacks {
  onEdit: (banner: Banner) => void;
  onDelete: (banner: Banner) => void;
  onView: (banner: Banner) => void;
}

export interface MemberColumnCallbacks {
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
  onView?: (member: Member) => void;
}

export interface QueryColumnCallbacks {
  onEdit: (Query: Query) => void;
  onDelete: (Query: Query) => void;
  onView?: (Query: Query) => void;
}


export interface BlogPreviewProps {
  data: BlogFormValues & { createdAt?: string };
  onSubmit: () => void;
  onBack: () => void;
  mode: string;
  showButton?: boolean
  createMutation?: UseMutationResult<any, Error, any>;
  updateMutation?: UseMutationResult<any, Error, any>;
}

export interface CampaignPreviewProps {
  data: CampaignFormValues & { createdAt?: string; existingImages?: string[], organizer?: string, raisedAmount?: number };
  onSubmit: () => void;
  onBack: () => void;
  mode?: "add" | "edit" | "view" | "preview-edit";
  showButton?: boolean
  createMutation?: UseMutationResult<any, Error, any>;
  updateMutation?: UseMutationResult<any, Error, any>;
}

export interface CommentFormProps {
  initialData?: Comment;
  onClose: () => void;
  mode: "edit" | "view";
}

export interface FeedbackFormProps {
  initialData?: Feedback;
  onClose: () => void;
  mode: "edit" | "view";
}

export interface AdminCustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  buttonText: string;
  loading?: boolean
}

export interface LanguageToggleProps {
  language: "en" | "hi";
  onChange: (lang: "en" | "hi") => void;
}

export interface LocationPickerProps {
  value: {
    location: { en: string; hi: string };
    latitude: number | null;
    longitude: number | null;
  };
  onChange: (val: { location: { en: string; hi: string }; latitude: number; longitude: number }) => void;
  disabled?: boolean;
}

export interface DonationPieChartProps {
  data: { name: string; value: number }[];
  colors?: string[];
}

export interface Notification {
  id: number;
  title: string;
  description: string;
  type: "info" | "success" | "warning" | "alert";
  time: string;
}

export interface SettingItem {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
  type: "toggle" | "info" | "component" | "action";
  component?: JSX.Element;
  onClick?: () => void;
}

import { ChangeEvent, KeyboardEvent, ReactNode, RefObject } from "react";
import { TableColumn } from "react-data-table-component";
import { Banner } from "./banner";
import { UseMutationResult } from "@tanstack/react-query";
import { Member } from "./members";
import { Query } from "./query";
import { Feedback } from "./feedback";


export interface DropdownOption<T> {
  label: string;
  value: T;
  disabled?: boolean; 
  names?: any;
}


export interface AdminDropdownProps<T> {
  options: readonly DropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  icon?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  width?: string
}

export interface AdminCustomInputProps {
  label?: string;
  icon?: string;
  type?: string;
  as?: "input" | "textarea";
  placeholder?: string;
  value: string | number | undefined;
  onChange?: (e: ChangeEvent<any>) => void;
  error?: string;
  name?: string;
  onKeyDown?: (e: KeyboardEvent<any>) => void;
  className?: string,
  disabled?: boolean;
  readOnly?: boolean;
  ref?: RefObject<any>
}

export interface AdminFileItem {
  file?: File;
  url: string;
  status: "processing" | "success" | "error";
  progress: number;
}

export interface AdminCustomFileInputProps {
  label?: string;
  name: string;
  onChange: (files: File[], updatedImageUrls?: string[]) => void;
  error?: string;
  disabled?: boolean;
  mode?: "add" | "edit" | "view" | "preview-edit";
  initialUrls?: string[];
  initialFiles?: File[];
  uploadType?: "single" | "multiple";
}

export interface AdminMultiInputListProps {
  label: string;
  values: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  isView?: boolean;
  colorClass?: { normal: string; view: string }; // optional styling
  error?: string | string[];
}

export interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  width?: string;
  className?: string;
  mobileFullScreen?: boolean;
  mode?: string
}

export interface AdminDataTableWrapperProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
}

export interface DashboardData {
  activeCampaign: number;
  totalMembers: number;
  totalFunds: number;
  pendingRequest: number;
}