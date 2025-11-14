import { BlogFormValues } from "@/src/utils/validations/FormValidation";
import { UseMutationResult } from "@tanstack/react-query";


export interface Blog {
  id: number;
  creator: string;
  title: string;
  description: string;
  summary: string;
  quote: string;
  quoteAuthor: string;
  category: string;
  content: string;
  author: string;
  tags?: string[];
  keyPoints?: string[];
  location: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt?: string;
  images?: (string | File)[];
  imageUrl?: string[];
}
export type BlogFormRequiedFields = {
  title: string;
  creator: string;
  description: string;
  summary: string;
  quote: string;
  quoteAuthor: string;
  category: string;
  location: string;
  tags?: string[];
  keyPoints?: string[];
};



export interface BlogFormProps {
  initialData?: Partial<BlogFormValues> & Partial<Blog>;
  onClose: () => void;
  readOnly?: boolean;
  mode?: "add" | "edit" | "view";
  onPreview?: (data: BlogFormValues) => void;
  createMutation: UseMutationResult<any, Error, BlogFormValues, unknown>;
  updateMutation: UseMutationResult<any, Error, { id: string; values: BlogFormValues }, unknown>;
}


export interface BlogColumnCallbacks {
  onEdit: (blog: Blog) => void;
  onDelete: (blog: Blog) => void;
  onView: (blog: Blog) => void;
}


export type SearchField = "title" | "location" | "category" | "creator";