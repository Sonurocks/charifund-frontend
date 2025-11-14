// src/services/authApi.ts
import api from "./api";

export const loginUser = async (credentials: { email: string; password: string }) => {
  const { data } = await api.post("/web/user/login", credentials);
  return data; 
};

export const registerUser = async (credentials: { email: string; password: string }) => {
  
  const { data } = await api.post("/user/register", credentials);
  return data; 
};
