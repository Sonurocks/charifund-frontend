import apiServer, { ApiEndpoints } from "./apiServer";

export const fetchBlogByIdServerSide = async (id: string) => {  
  const { data } = await apiServer.get(`${ApiEndpoints.blogbyId}/${id}`);
  return data;
};
export const fetchCampaignByIdServerSide = async (id: string) => {  
  const { data } = await apiServer.get(`${ApiEndpoints.campaignById}/${id}`);
  return data;
};