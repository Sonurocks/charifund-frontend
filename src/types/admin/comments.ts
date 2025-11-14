export interface Comment {
  id: string;
  name: string;
  comment: string;
  createdAt?: string;
  status:string;
  approved?: boolean;
  email?: string | undefined;
}

export interface CommentColumnCallbacks {
  onEdit: (comment: Comment) => void;
  onDelete: (comment: Comment) => void;
  onView: (comment: Comment) => void;
}

export interface Reply {
  id: string;
  name: string;
  email: string;
  comment: string;
  status: string;
  campaignId: string;
  blogId: string;
  parentCommentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RepliesResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  replies: Reply[];
}