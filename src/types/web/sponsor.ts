// ============================================================
// Sponsor Types (Public / Web)
// ============================================================

export type LocalizedString = string | { en: string; hi: string };

export interface Sponsor {
  id: string;
  slug: string;
  name: LocalizedString;
  logo: string;
  shortDescription: LocalizedString;
  description: LocalizedString;
  website?: string;
  category: LocalizedString;
  location?: LocalizedString;
  createdAt?: string;
  updatedAt?: string;
}

export interface SponsorListResponse {
  sponsors: Sponsor[];
  totalSponsors?: number;
  totalPages?: number;
  currentPage?: number;
}
