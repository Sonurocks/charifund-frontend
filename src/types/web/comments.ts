// export interface Comment {
//   id: string;
//   name: string;
//   comment: string;
//   createdAt?: string;
//   status:string;
//   approved?: boolean;
//   email?: string | undefined;
// }

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

export interface Comment {
  id: string;
  name: string;
  comment: string;
  image?: string;
  likeCount?: number;
  timeAgo?: string;
  createdAt?: string;
  totalReplies?: number;
  isPending?: boolean;
  isLiked?: boolean;
}

export interface CommentsProps {
  CommentId: string; 
}

export interface ReplyCommentProps {
  id: string | null;
  handleReplyModel: (value: boolean) => void
}

export interface addReplyprops{
    id:string|null;
    data:{
    comment: string;
    name: string;
    email: string
    }
}

export interface CommentType {
  id: string;
  name: string;
  comment: string;
  blogId: string;
  isPending?: boolean;
  createdAt?: string;
  timeAgo?: string;
  likeCount?: number;
  replies?: CommentType[];
}