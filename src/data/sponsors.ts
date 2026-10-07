import { Sponsor } from "@/src/types/web/sponsor";

export const sponsorsData: Sponsor[] = [
  {
    id: "sponsor-001",
    slug: "tata-trusts",
    name: "Furnishing Shop",
    logo: "/assets/furnishingshop1.webp",
    shortDescription:
      "Tata Trusts is one of India's oldest philanthropic organisations, supporting education and healthcare.",
    description:
      "Tata Trusts, established over 100 years ago, is one of India's oldest, most reputed philanthropic organisations. The trusts have been at the forefront of pioneering social change by serving underprivileged communities across the country in areas such as healthcare, education, rural livelihoods, water & sanitation, and digital transformation. YUWA India is honoured to have the support of Tata Trusts in our mission to empower children and communities.",
    website: "https://www.tatatrusts.org",
    category: "Healthcare & Education",
    location: "India",
  },
  {
    id: "sponsor-002",
    slug: "help-age-india",
    name: "Gold's Gym",
    logo: "/assets/goldgym4.webp",
    shortDescription:
      "HelpAge India works for the cause and care of disadvantaged elderly persons and to improve their quality of life.",
    description:
      "HelpAge India is a leading charity in India working with and for disadvantaged elderly. HelpAge India was established in 1978 and has since then devoted all its efforts to improve the quality of life of India's poor elderly. The organisation works in over 1000 locations and 25 states across India. YUWA India is proud to partner with HelpAge India to extend support to our community outreach programs.",
    website: "https://www.helpageindia.org",
    category: "Community Partner",
    location: "India",
  },
  {
    id: "sponsor-003",
    slug: "cry-india",
    name: "Jeewan Charitable",
    logo: "/assets/newjeewan.webp",
    shortDescription:
      "CRY works to ensure children's rights and create pathways for their holistic development.",
    description:
      "Child Rights and You (CRY) is an Indian non-governmental organization dedicated to the cause of children. Established in 1979 by Rippan Kapur, CRY's vision is a world where every child enjoys their fundamental rights to survival, protection, development and participation. CRY supports over 2.7 million children across 21 Indian states. YUWA India collaborates with CRY to advocate for child rights and drive systemic change.",
    website: "https://www.cry.org",
    category: "Child Rights",
    location: "India",
  },
  {
    id: "sponsor-004",
    slug: "smile-foundation",
    name: "Skae English",
    logo: "/assets/skae.webp",
    shortDescription:
      "Smile Foundation works directly with underprivileged children and families for healthcare and education.",
    description:
      "Smile Foundation is a national development organization directly benefiting over 1.5 million underprivileged children and their families every year through more than 400 welfare projects on education, healthcare, livelihood and women empowerment across 2,000 remote villages and urban slums in 25 states of India. YUWA India is grateful for Smile Foundation's partnership in scaling our nutrition and education programs.",
    website: "https://www.smilefoundationindia.org",
    category: "Education & Healthcare",
    location: "India",
  },
  {
    id: "sponsor-005",
    slug: "pratham-foundation",
    name: "Naval's Academy",
    logo: "/assets/navalacademy.webp",
    shortDescription:
      "Pratham is committed to providing quality education to underprivileged children across India.",
    description:
      "Pratham is a not-for-profit organization, founded in 1994 to provide pre-school education to children in Mumbai. It has now become one of the largest NGOs in India focused on quality education for underprivileged children. Pratham works across 21 Indian states, 350 districts and 50,000 villages, benefiting an estimated 3 million children annually. YUWA India leverages Pratham's educational frameworks in its learning programs.",
    website: "https://www.pratham.org",
    category: "Education",
    location: "India",
  }
];

export const getAllSponsors = (): Sponsor[] => sponsorsData;

export const getSponsorBySlug = (slug: string): Sponsor | null =>
  sponsorsData.find((s) => s.slug === slug) ?? null;
