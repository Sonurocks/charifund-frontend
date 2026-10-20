
import { SendMsgFormValues, VolunteerValues } from "@/src/utils/validations/FormValidation";

//  Get all banners 
export const fetchAllBanners = async (page: number = 1, limit: number = 10, pageName?: string) => {
  let url = `/web/banner/getAllBanners?page=${page}&limit=${limit}`;
  if (pageName) {
    url += `&pageName=${encodeURIComponent(pageName)}`;
  }
  const { data } = await api.get(url);
  return data;
};

export const fetchApprovedFeedbacks = async (page: number, limit: number, status: string | null) => {
  const statusQuery = status && status !== "all" ? `&status=${status}` : "";
  const { data } = await api.get(`/web/feedback/get-feedback?page=${page}&limit=${limit}&${statusQuery}`);
  return data;
};

// Create feedback
export const createFeedback = async (formData: FormData) => {
  const { data } = await api.post(`/web/feedback/add-feedback`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return data;
};


// ✅ Get all events with pagination
export const fetchAllEvents = async (
  page: number = 1,
  limit: number = 10,
  search?: string
) => {
  let url = `/web/event/getAllEvents?page=${page}&limit=${limit}`;

  
  if (search && search.trim() !== "") {
    url += `&search=${encodeURIComponent(search)}`;
  }

  const { data } = await api.get(url);
  return data;
};

// ✅ Get single event by ID
export const fetchEventById = async (id: string) => {  
  const { data } = await api.get(`/web/event/getEventById/${id}`, {
    headers: {
      'Accept-Language': 'en',
      'X-Language': 'en',
    }
  });
  return data;
};


// src/services/commentApi.ts
import { RepliesResponse } from "@/src/types/web/comments";
import { ContactFormValues } from "@/src/types";
import api from "./api";

// ✅ Fetch all comments
export const fetchComments = async (page: number, limit: number, status: string | null) => {
  const { data } = await api.get(`/admin/comment/getAllComments?page=${page}&limit=${limit}&status=${status}`);
  return data;
};

// ✅ Fetch comments by blog ID
export const fetchCommentsById = async (id: string) => {
  const { data } = await api.get(`/admin/comment/getCommentById/${id}`);
  return data;
};

//fetch get-comment by id 
export const fetchgetcomments = async (id: string) => {
  try {
    const { data } = await api.get(`/web/comment/get-comments/${id}`);
    return data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      // Backend throws 404 when no comments exist instead of empty array.
      // We must handle this so React Query doesn't get stuck caching old data.
      return { comments: [] };
    }
    throw error;
  }
};


// ✅ Create a new comment
export const createComment = async (id: string,
  comment: { name: string; comment: string; email: string }) => {

  const { data } = await api.post(`/web/comment/add-comment/${id}`, comment);
  return data;
};

// ✅ Update a comment
export const updateComment = async (
  id: string,
  comment: { approved: boolean; }
) => {
  const { data } = await api.put(`/admin/comment/moderate-comment/${id}`, comment);
  return data;
};

// ✅ Delete a comment
export const deleteComment = async (id: string) => {
  const { data } = await api.delete(`/admin/comment/delete-comment/${id}`);
  return data;
};

// ✅ Like/Unlike a comment
export const likeComment = async (commentId: string, change: number) => {
  const { data } = await api.post(`/web/comment/like-comment/${commentId}`, { change });
  return data;
};

// Add reply
export const addReply = async (id: string|null,
  reply: { name: string; comment: string; email: string }) => {

  const { data } = await api.post(`/web/comment/reply-comment/${id}`, reply);
  return data;
};

//get replies by comment id
export const getRepliesByCommentId=async(id:string|null,page:number,limit:number)=>{

  const {data} =await api.get<RepliesResponse>(`/web/comment/get-replies/${id}?page=${page}&limit=${limit}`);
  return data;
}

// Get all members with pagination
export const fetchAllMembers = async (page: number = 1, limit: number = 10) => {
  const { data } = await api.get(`/web/member/getAllMembers?page=${page}&limit=${limit}`);
  return data;
};

// Get single member by ID
export const fetchMemberById = async (id: string) => {
    const { data } = await api.get(`/web/member/getMemberById/${id}`);
    return data;
};

export const fetchFeedback = async () => {
  const { data } = await api.get(`/web/feedback/get-feedback`);
  return data.feedback;
};

export const VolunteerInformationForm = async (values: VolunteerValues) => {
  const { data } = await api.post(`/web/form/become-volunteer`, values);
  return data;
};

export const SendMsgInformationForm = async (values: SendMsgFormValues) => {
  const { data } = await api.post(`/web/form/donation-message`, values);
  return data;
};


export interface CreatePaymentOrderPayload {
  amount: number;
  campaignId?: string;
  campaignTitle?: string;
  paymentMethod: "online" | "offline";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  pan?: string;
  message?: string;
}

export interface CreatePaymentOrderResponse {
  orderId?: string; 
  donationId?: string;
  status?: string;
  paymentMethod?: string;
  key?: string;
  amount?: number;
  currency?: string;
  msg?: string;
  message?: string;
}

export const createPaymentOrder = async (orderData: CreatePaymentOrderPayload): Promise<CreatePaymentOrderResponse> => {
    const { data } = await api.post<CreatePaymentOrderResponse>(`/web/payment/create-order`, orderData);
    return data;
}

export const verifyPaymentOrder = async (verifyData: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
    const { data } = await api.post(`/web/payment/verify-payment`, verifyData);
    return data;
}

export const fetchDonationReceipt = async (identifier: string) => {
    const { data } = await api.get(`/web/payment/receipt/${encodeURIComponent(identifier)}`);
    return data;
}

export const ContactUsForm = async (values:ContactFormValues) => {
  const { data } = await api.post(`/web/form/contact-query`, values);
  return data;
};

export const NewsletterEmailForm = async (email: string) => {
  const { data } = await api.post(`/web/email/add-email`, { email });
  return data;
};

export const fetchCategory = async (page: number = 1, limit: number = 10) => {
  const { data } = await api.get(`/admin/category/get-category?page=${page}&limit=${limit}`);
  return data;
};
export const fetchCategoryById = async (id:string) => {
  const { data } = await api.get(`/admin/category/get-category/${id}`);
  return data;
};

export const fetchAllCampaigns = async (page: number = 1, limit: number = 2,searchText = "All") => {
  const { data } = await api.get(`/web/campaign/getAllCampaigns?page=${page}&limit=${limit}&search=${searchText}`);
  return data;
};

export const fetchCampaignById = async (id: string) => {
  const { data } = await api.get(`/web/campaign/getCampaignById/${id}`);
  return data;
};

// Get all blogs with pagination
export const fetchAllBlogs = async (page: number = 1, limit: number = 10,searchText?:string) => {
  const { data } = await api.get(`/web/blog/getAllBlogs?page=${page}&limit=${limit}&search=${searchText || ""}`);
  return data;
};

// Get single blog by ID
export const fetchBlogById = async (id: string) => {  
  const { data } = await api.get(`/web/blog/getBlogById/${id}`);
  return data;
};

// Unified Home Overview Data
export const fetchHomeOverview = async () => {
  const { data } = await api.get("/web/home-overview");
  return data;
};

