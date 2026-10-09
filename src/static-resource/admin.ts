import { DropdownOption } from "@/src/types/admin";
import { BannerSearchField } from "@/src/types/web/banner";


export const CampaignSearchOptions = [
  { label: "Title", value: "title" },
  { label: "Category", value: "category" },
  { label: "Status ", value: "status" },
] as const;

export const CategorySearchOptions = [
  { label: "Name", value: "name" },
] as const;


export const BlogSearchOptions = [
  { label: "Title", value: "title" },
  { label: "Category", value: "category" },
  { label: "Location", value: "location" },
  { label: "Creator", value: "creator" },
] as const;


export const CommentSearchOptions = [
  { label: "Status", value: "status" },

]
export const EventSearchOptions = [
  { label: "Title", value: "title" },
  { label: "Location", value: "location" },
  { label: "Date ", value: "date" },
  { label: "Status", value: "status" },
] as const;

export const BannerSearchOptions = [
  { label: "Title", value: "title" },
  { label: "Subtitle", value: "subtitle" },
  { label: "Priority", value: "priority" },
] as const satisfies readonly DropdownOption<BannerSearchField>[];

// Centralized page names for dynamic banner system
export const BANNER_PAGES = [
  "Home",
  "About Us",
  "Campaign",
  "Volunteer",
  "Contact Us",
  "Blog",
  "Events",
  "FAQ",
  "Sponsors",
  "Team",
  "Donate Us",
] as const;

export type BannerPageName = (typeof BANNER_PAGES)[number];

export const BannerPageOptions = BANNER_PAGES.map((page) => ({
  label: page,
  value: page,
}));


export const memberSearchOptions = [
  { label: "Name", value: "name" },
  { label: "Position", value: "position" },
  { label: "Title", value: "title" },
] as const;
