// src/services/web/apiServer.ts
import axios from "axios";

const apiServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiServer;


export const ApiEndpoints = {
  blogbyId:"/web/blog/getBlogById",
  campaignById:"/web/campaign/getCampaignById",
}