import { CampaignType } from "../types/web/campaign";
import { CommentType } from "../types/web/comments";



export function savePendingComment(comment: CommentType) {
  if (typeof window === "undefined") return;

  const existing: CommentType[] = JSON.parse(
    localStorage.getItem("LocalComments") || "[]"
  );
  const updated = [...existing, { ...comment, isPending: true }];
  localStorage.setItem("LocalComments", JSON.stringify(updated));
}

export function getLocalComments(blogId: string): CommentType[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem("LocalComments");
  if (!stored) return [];

  try {
    const allLocalComments: CommentType[] = JSON.parse(stored);
    return allLocalComments
      .filter((c) => c.blogId === blogId)
      .map((c) => ({ ...c, isPending: true }));
  } catch (error) {
    console.error("❌ Failed to parse Local comments:", error);
    return [];
  }
}

export function removeLocalComment(id: string) {
  if (typeof window === "undefined") return;

  const existing: CommentType[] = JSON.parse(
    localStorage.getItem("LocalComments") || "[]"
  );
  const updated = existing.filter((c) => c.id !== id);
  localStorage.setItem("LocalComments", JSON.stringify(updated));
}

export function getLikeCounts(): Record<string, number> {
  if (typeof window === "undefined") return {};
  
  try {
    const stored = localStorage.getItem("LikeCounts");
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("❌ Failed to parse like counts:", error);
    return {};
  }
}

export function saveLikeCounts(likeCounts: Record<string, number>) {
  if (typeof window === "undefined") return;
  
  localStorage.setItem("LikeCounts", JSON.stringify(likeCounts));
}


export function updateLikeCount(commentId: string, newCount: number) {
  const likeCounts = getLikeCounts();
  likeCounts[commentId] = newCount;
  saveLikeCounts(likeCounts);
}


export function mergeComments(
  apiComments: CommentType[],
  blogId: string
): CommentType[] {
  const localComments = getLocalComments(blogId);
  const likeCounts = getLikeCounts();

  const filteredLocal = localComments.filter((local) => {
    const existsInApi = apiComments.some((api) => api.id === local.id);
    if (existsInApi) {
      removeLocalComment(local.id); // cleanup storage
      return false;
    }
    return true;
  });

  // Merge API comments with preserved like counts
  const mergedApiComments = apiComments.map(comment => ({
    ...comment,
    likeCount: likeCounts[comment.id] !== undefined ? likeCounts[comment.id] : (comment.likeCount || 0)
  }));

  // Merge local comments with preserved like counts
  const mergedLocalComments = filteredLocal.map(comment => ({
    ...comment,
    likeCount: likeCounts[comment.id] !== undefined ? likeCounts[comment.id] : (comment.likeCount || 0)
  }));

  return [...mergedApiComments, ...mergedLocalComments];
}

export function savePendingCampaign(campaign: CampaignType) {
  if (typeof window === "undefined") return;

  const existing: CampaignType[] = JSON.parse(
    localStorage.getItem("LocalCampaigns") || "[]"
  );
  const updated = [...existing, { ...campaign, isPending: true }];
  localStorage.setItem("LocalCampaigns", JSON.stringify(updated));
}


export function getLocalCampaigns(): CampaignType[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem("LocalCampaigns");
  if (!stored) return [];

  try {
    const parsed: CampaignType[] = JSON.parse(stored);
    return parsed.map((c) => ({ ...c, isPending: true }));
  } catch (error) {
    console.error("❌ Failed to parse local campaigns:", error);
    return [];
  }
}


export function removeLocalCampaign(id: string) {
  if (typeof window === "undefined") return;

  const existing: CampaignType[] = JSON.parse(
    localStorage.getItem("LocalCampaigns") || "[]"
  );
  const updated = existing.filter((c) => c.id !== id);
  localStorage.setItem("LocalCampaigns", JSON.stringify(updated));
}


export function mergeCampaigns(apiCampaigns: CampaignType[]): CampaignType[] {
  const localCampaigns = getLocalCampaigns();

  const filteredLocal = localCampaigns.filter((local) => {
    const existsInApi = apiCampaigns.some((api) => api.id === local.id);
    if (existsInApi) {
      removeLocalCampaign(local.id); 
      return false;
    }
    return true;
  });

  return [...apiCampaigns, ...filteredLocal];
}


