
import { QueryFilters } from "@/src/types/web/query";
import api from "./api";
import { QueryFormValues } from "@/src/utils/validations/FormValidation";

//  Fetch all queries with pagination
export const fetchAllQueries = async (page: number = 1, limit: number = 10, filterValue?: string, filterField?: string) => {

  let url = `/admin/form/getAllForms?page=${page}&limit=${limit}`;
  console.log("object check", filterValue)
  let searchValue = filterValue === "all" ? "" : filterValue;

  if (filterValue) url += `&${encodeURIComponent(filterField ?? "")}=${encodeURIComponent(searchValue ?? "")}`;

  const { data } = await api.get(url);
  return data;
};

// Fetch a single query by ID
export const fetchQueryById = async (id: string) => {
  const { data } = await api.get(`/admin/form/getFormById/${id}`);
  return data;
};

//  Update query (e.g., mark as viewed)
export const updateQuery = async (
  id: string,
  values: Partial<QueryFormValues>
) => {
  const { data } = await api.put(`/admin/form/moderate-form/${id}`, values);
  return data;
};

// ✅ Delete query
export const deleteQuery = async (id: string) => {
  const { data } = await api.delete(`/admin/form/delete-form/${id}`);
  return data;
};
