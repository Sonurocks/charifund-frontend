// ============================================================
// Sponsor Types
// ============================================================

export interface Sponsor {
  id: string;
  slug: string;
  name: string;
  logo: string;
  shortDescription: string;
  description: string;
  website?: string;
  category: string;
  location?: string;
}
