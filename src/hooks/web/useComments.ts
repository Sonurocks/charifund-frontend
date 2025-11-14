// // src/hooks/useComment.ts
import { useQuery, useMutation, useQueryClient, useInfiniteQuery, QueryFunctionContext } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addReplyprops, RepliesResponse } from "../../types/web/comments";
import { addReply, createComment, deleteComment, fetchComments, fetchCommentsById, fetchgetcomments, getRepliesByCommentId, updateComment } from "@/src/services/web";

const Replylimit=3;

export const useFetchComments = (page: number, limit: number, status: string | null) => {
  return useQuery({
    queryKey: ["comments", page, limit, status],
    queryFn: () => fetchComments(page, limit, status),
  });
};

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
    select: (data) => data.comments || [], 
  });
};





// ======================= Create Comment ======================= //
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { comment: string; name: string; email: string } }) =>
      createComment(id, data),
    onSuccess: (data, variables) => {
      const existingComments = JSON.parse(localStorage.getItem("LocalComments") || "[]");
      const newComment = {
        id: data.comment?.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: variables.data.name,
        comment: variables.data.comment,
        email: variables.data.email,
        blogId: variables.id, 
        isPending: true,
        createdAt: new Date().toISOString(),
        timeAgo: "Just now",
        likeCount: 0
      };

      // 3. Add new comment to localStorage
      const updatedComments = [...existingComments, newComment];
      localStorage.setItem("LocalComments", JSON.stringify(updatedComments));

      // 4. Invalidate the specific query for this blog
      queryClient.invalidateQueries({ queryKey: ["comments", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["comment", variables.id] });
      
      // 5. Dispatch custom event to notify components
      window.dispatchEvent(new CustomEvent('commentAdded', { 
        detail: { blogId: variables.id, comment: newComment } 
      }));
      
      
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create comment");
    },
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

// ======================= Add Reply ======================= //
export const useAddReply=()=>{
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn:({id,data}:addReplyprops)=>addReply(id,data),
        onSuccess:(data)=>{
            console.log("Reply Added",data)
        },
        onError:()=>{
            console.log("data not added");
        }
      })
}

// ======================= Get Replies for specify comment ======================= //

export const useGetReplies=(id:string|null)=>{
  return useInfiniteQuery<RepliesResponse>({
    queryKey: ["replies", id],
    queryFn: ({ pageParam = 1 }: QueryFunctionContext) =>
      getRepliesByCommentId(id, pageParam as number, Replylimit),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1; 
      }
      return undefined; 
    },
    initialPageParam: 1,
  });
}
