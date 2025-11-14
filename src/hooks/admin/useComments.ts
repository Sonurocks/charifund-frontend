// // src/hooks/useComment.ts
import { deleteComment, fetchComments, fetchCommentsById, fetchgetcomments, updateComment } from "@/src/services/admin/commentsApi";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery, QueryFunctionContext, keepPreviousData } from "@tanstack/react-query";
import toast from "react-hot-toast";


const Replylimit = 3;
// ======================= Fetch all Comments ======================= //

export const useFetchComments = (page: number, limit: number, status: string | null) => {
  return useQuery({
    queryKey: ["comments", page, limit, status],
    queryFn: () => fetchComments(page, limit, status),
    placeholderData: keepPreviousData

  });
};


// ======================= Fetch single Comment ======================= //


export const useFetchCommentById = (id: string) => {

  return useQuery({
    queryKey: ["comment", id],
    queryFn: () => fetchCommentsById(id),
    retry: 0,
    select: (data) => data || [],
  });
};


//fetch by id 
export const useFetchgetcomments = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["comment", id],
    queryFn: () => fetchgetcomments(id),
    retry: 0,
    enabled,
    select: (data) => data.comments || [], // return only comments array
  });
};

// ======================= Update Comment ======================= //
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { content: string; author?: string, approved: boolean } }) =>
      updateComment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast.success("Comment updated successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update comment");
    },
  });
};

// ======================= Delete Comment ======================= //
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast.dismiss();
      toast.success("Comment deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete comment");
    },
  });
};
