"use client";

import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
});

//  Add Authorization header and language header dynamically
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add language header
  const currentLang = localStorage.getItem('lang') || 'en';
  if (config.headers) {
    config.headers['Accept-Language'] = currentLang;
    config.headers['X-Language'] = currentLang;
  }

  // Dynamically set Content-Type
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
}, (error) => Promise.reject(error));

// Add global response interceptor to handle auth failures
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 ||
      error.response?.status === 403 ||
      error.response?.data?.message === "invalid signature" ||
      error.response?.data?.message === "jwt expired"
    ) {
      Cookies.remove("token");
      localStorage.removeItem("user");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
