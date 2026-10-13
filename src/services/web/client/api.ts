"use client";

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
});

api.interceptors.request.use((config) => {
  const currentLang = typeof window !== "undefined" ? localStorage.getItem('lang') || 'en' : 'en';
  if (config.headers) {
    config.headers['Accept-Language'] = currentLang;
    config.headers['X-Language'] = currentLang;
  }

  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
}, (error) => Promise.reject(error));

export default api;
