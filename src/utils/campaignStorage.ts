export interface Campaign {
  id: string;
  title: string;
  description: string;
  isPending?: boolean;
  createdAt?: string;
}

// Save pending campaign locally
export function savePendingCampaign(campaign: Campaign) {
  const existing = JSON.parse(localStorage.getItem("LocalCampaigns") || "[]");
  const updated = [...existing, { ...campaign, isPending: true }];
  localStorage.setItem("LocalCampaigns", JSON.stringify(updated));
}

// Get all pending campaigns for UI
export function getLocalCampaigns(): Campaign[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("LocalCampaigns");
    if (!stored) return [];
    const parsed: Campaign[] = JSON.parse(stored);
    return parsed.map(c => ({ ...c, isPending: true }));
  } catch (error) {
    console.error("❌ Failed to parse local campaigns:", error);
    return [];
  }
}

// Remove a pending campaign (e.g. once approved by API)
export function removeLocalCampaign(id: string) {
  const existing = JSON.parse(localStorage.getItem("LocalCampaigns") || "[]");
  const updated = existing.filter((c: Campaign) => c.id !== id);
  localStorage.setItem("LocalCampaigns", JSON.stringify(updated));
}
