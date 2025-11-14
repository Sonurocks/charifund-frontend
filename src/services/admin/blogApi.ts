// src/services/blogApi.ts
import api from "./api";

// ✅ Create a blog
export const createBlog = async (blog: FormData) => {
  const { data } = await api.post("/admin/blog/create-blog", blog);
  return data;
};

// ✅ Get all blogs with pagination
export const fetchAllBlogs = async (page: number = 1, limit: number = 10, search?: string, searchField?: string) => {
  let url = `/admin/blog/getAllBlogs?page=${page}&limit=${limit}`;
  if (search && searchField) {
    url += `&${encodeURIComponent(searchField)}=${encodeURIComponent(search)}`;
  } else if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  const { data } = await api.get(url);
  return data;
};

// ✅ Get single blog by ID
export const fetchBlogById = async (id: string) => {
  const { data } = await api.get(`/admin/blog/getBlogById/${id}`);
  return data;
};

// ✅ Update blog
export const updateBlog = async (id: string, blog: FormData) => {
  const { data } = await api.put(`/admin/blog/update-blog/${id}`, blog);
  return data;
};

// ✅ Delete blog
export const deleteSingleBlog = async (id: string) => {
  const { data } = await api.delete(`/admin/blog/delete-blog/${id}`);
  return data;
};
