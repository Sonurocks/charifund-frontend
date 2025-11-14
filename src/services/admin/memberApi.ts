import { MemberFormValues } from "@/src/utils/validations/FormValidation";
import api from "./api";


// Create a member
export const createMember = async (member: MemberFormValues) => {
  const { data } = await api.post("/admin/member/add-member", member);
  return data;
};

// Get all members with pagination
export const fetchAllMembers = async (page: number = 1, limit: number = 10,search?:string, searchField?: string) => {
  let url = `/admin/member/getAllMembers?page=${page}&limit=${limit}`;
  if(search && searchField) url += `&${encodeURIComponent(searchField)}=${encodeURIComponent(search)}`
  const { data } = await api.get(url);
  return data;
};




// Get single member by ID
export const fetchMemberById = async (id: string) => {
  const { data } = await api.get(`/admin/member/getMemberById/${id}`);
  return data;
};

//  Update member
export const updateMember = async (id: string, member: Partial<MemberFormValues>) => {
  const { data } = await api.put(`/admin/member/update-member/${id}`, member);
  return data;
};

//  Delete member
export const deleteMember = async (id: string) => {
  const { data } = await api.delete(`/admin/member/delete-member/${id}`);
  return data;
};



