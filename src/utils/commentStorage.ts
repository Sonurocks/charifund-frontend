import { CommentType } from "../types/web/comments";

export function getLocalComments(blogId: string): CommentType[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("LocalComments");
  if (!stored) return [];

  try {
    const parsed: CommentType[] = JSON.parse(stored);
    return parsed
      .filter(c => c.blogId === blogId)
      .map(c => ({ ...c, isPending: true }));
  } catch (error) {
    console.error("❌ Failed to parse local comments:", error);
    return [];
  }
}

// Remove a list of comments from local storage
export function removeLocalComments(idsToRemove: string[]) {
  if (typeof window === "undefined" || !idsToRemove.length) return;
  const idsToRemoveSet = new Set(idsToRemove);
  
  const existing: CommentType[] = JSON.parse(localStorage.getItem("LocalComments") || "[]");
  const updated = existing.filter(c => !idsToRemoveSet.has(c.id));
  localStorage.setItem("LocalComments", JSON.stringify(updated));

}

export function mergeAndCleanComments(apiComments: CommentType[], blogId: string): CommentType[] {
  const localComments = getLocalComments(blogId);

  const apiCommentSet = new Set(apiComments.map(c => c.id));

const filteredLocalComments = localComments.filter(
  lc => !apiCommentSet.has(lc.id)
);
       localStorage.setItem("LocalComments", JSON.stringify(filteredLocalComments));


  // Merge API comments + pending local comments
  return [...apiComments, ...filteredLocalComments];
}

