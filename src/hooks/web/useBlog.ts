import { fetchAllBlogs, fetchBlogById } from "@/src/services/web";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

// Fetch blogs with pagination
export const useFetchAllBlogs = (page: number, limit: number = 10,search?:string) => {
  return useQuery({
    queryKey: ["blogs", page, limit,search],
    queryFn: () => fetchAllBlogs(page, limit,search),
    placeholderData: keepPreviousData,
  });
};

// Fetch single blog
export const useFetchSingleBlog = (id?: string) => {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: () => fetchBlogById(id!),
    enabled: !!id,
  });
};
