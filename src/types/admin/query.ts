import { UseMutationResult } from "@tanstack/react-query";
import { QueryFormValues } from "../../utils/validations/FormValidation"; 

export type QuerySearchField = "title" | "subtitle"; 

export interface Query {
    id?: string;
  isViewed: boolean;
  formType: string;
  email: string;
  phone: string;
  message: string;
  title: string;
  address: string;  
  createdAt?: string;
  firstName: string;
  lastName: string;
  occupation: string;
}
export interface QueryFormProps {
  initialData?: Partial<QueryFormValues> & Partial<Query>;
  onClose: () => void;
  mode?: "add" | "edit"; 
  createMutation: UseMutationResult<any, Error, QueryFormValues, unknown>;
  updateMutation: UseMutationResult<any, Error, { id: string; values: QueryFormValues }, unknown>;
}
export interface QueryColumnCallbacks {
  onEdit: (Query: Query) => void;
  onDelete: (Query: Query) => void;
  onView?: (Query: Query) => void; 
}

export interface QueryPreviewRowProps { label: string ; value: string | boolean | null; isLast?: boolean; isBool?: boolean}


export interface QueryFilters {
  isViewed?: string;
  formType?: string; 
}
