import { EventFormValues } from "@/src/utils/validations/FormValidation";
import { UseMutationResult } from "@tanstack/react-query";

export interface Event {
  id: number;
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  summary: { en: string; hi: string };
  status: string;
   startDate: Date | null;
  startTime: Date | null;
  endDate: Date | null;
  endTime: Date | null;
  images?: { en?: (string | File)[]; hi?: (string | File)[] }; 
  existingImages?: { en?: string[]; hi?: string[] };
  location: { en: string; hi: string };
  keyPoints: { en: string[]; hi: string[] }; 
}
export interface EventColumnCallbacks {
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
  onView: (event: Event) => void;
}
export interface EventFormProps {
  initialData?: Partial<EventFormValues> & Partial<Event>;
  onClose: () => void;
  readOnly?: boolean; 
  mode?: "add" | "edit" | "view"|"preview-edit";
  onPreview?: (values: EventFormValues) => void;
  createMutation?: UseMutationResult<any, unknown, any, unknown>;
  updateMutation?: UseMutationResult<any, unknown, any, unknown>;
}
export const EventsValue = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Live", value: "live" },
  { label: "Ended", value: "ended" },
  
] as const;