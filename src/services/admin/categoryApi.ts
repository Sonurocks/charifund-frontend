// src/services/categoryApi.ts
import api from "./api";

export const fetchCategory = async (
  page?: number,
  limit?: number,
  searchedData?: string,
  searchField?: string
) => {
  // Start with base URL
  let url = `/admin/category/get-category`;

  // Create a params array to build the query string
  const params: string[] = [];

  if (page !== undefined) params.push(`page=${page}`);
  if (limit !== undefined) params.push(`limit=${limit}`);
  if (searchField && searchedData) {
    params.push(`${encodeURIComponent(searchField)}=${encodeURIComponent(searchedData)}`);
  }

  // If we have any query params, append them
  if (params.length > 0) {
    url += `?${params.join("&")}`;
  }

  const { data } = await api.get(url);
  return data;
};

export const fetchCategoryById = async (id: string) => {
  const { data } = await api.get(`/admin/category/getCategoryById/${id}`);
  return data;
};

// Create a new category
export const createCategory = async (category: { name: { en: string; hi: string } }) => {
  const { data } = await api.post("/admin/category/create-category", category);
  return data;
};

// Update a category
export const updateCategory = async (id: string, category: { name: { en: string; hi: string } }) => {
  const { data } = await api.put(`/admin/category/update-category/${id}`, category);
  return data;
};

// Delete a category
export const deleteCategory = async (id: string) => {
  const { data } = await api.delete(`/admin/category/delete-category/${id}`);
  return data;
};
