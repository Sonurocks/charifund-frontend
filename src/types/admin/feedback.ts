export interface Feedback {
  id: string;
  name: string;
  designation: string;
  image?: Record<string, any> | null; 
  feedback: string;
  rating: number;
  status?:  string;
}

export interface FeedbackColumnCallbacks {
  onEdit: (feedback: Feedback) => void;
  onDelete: (feedback: Feedback) => void;
  onView: (feedback: Feedback) => void;
}
export const FeedbackSearchField = [
  { label: "Name", value: "name" },
  { label: "Rating", value: "rating" },
  { label: "Designation", value: "designation" },
  { label: "Status", value: "status" },
] as const;

export const FeedbackStatusField = [
  { label: "All", value: "All" },
  { label: "PENDING", value: "PENDING" },
  { label: "APPROVED", value: "APPROVED" },
  { label: "REJECTED", value: "REJECTED" },
] as const;