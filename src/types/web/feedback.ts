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

export interface FeedbackApiResponse {
  feedback: Feedback[];
  totalPages: number;
  page: number;
  limit: number;
}