import { fetchCategory, fetchCategoryById } from "@/src/services/web";
import { useQuery } from "@tanstack/react-query";


export const useFetchCategory = (page?: number, limit?: number) => {
  return useQuery({
    queryKey: ["categories",page, limit],
    queryFn: ()=> fetchCategory(page, limit),
  });
};

export const useFetchCategoryById = (id:string) => {
  return useQuery({
    queryKey: ["categories",id],
    queryFn: ()=> fetchCategoryById(id),
   enabled: !!id,
  });
};
