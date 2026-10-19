export interface ServiceItem {
  id: number;
  slug: string;
  titleKey: string;
  defaultTitle: string;
  descKey: string;
  defaultDesc: string;
  icon: string;
  image: string;
  highlights: string[];
  contentContext: {
    whatWeDo: string[];
    whoWeSupport: string;
  };
}

export const servicesData: ServiceItem[] = [
  {
    id: 1,
    slug: "child-education-welfare",
    titleKey: "Child Education & Welfare",
    defaultTitle: "Child Education & Welfare",
    descKey: "Supporting children with access to education, learning opportunities, care and a brighter future.",
    defaultDesc: "Supporting children with access to education, learning opportunities, care and a brighter future.",
    icon: "lucide:graduation-cap",
    image: "/assets/helpingeachother2.webp",
    highlights: ["School Supplies", "Learning Centers", "Child Care Support"],
    contentContext: {
      whatWeDo: [
        "Educational support for underprivileged children.",
        "Providing essential school supplies and learning materials.",
        "Establishing community learning centers to foster growth.",
        "Creating awareness about the importance of child welfare and basic rights.",
      ],
      whoWeSupport: "We focus on supporting underprivileged children from marginalized communities who lack access to basic educational resources and care.",
    },
  },
  {
    id: 2,
    slug: "women-empowerment",
    titleKey: "Women Empowerment",
    defaultTitle: "Women Empowerment",
    descKey: "Supporting women and girls through skill development, confidence building and opportunities for greater independence.",
    defaultDesc: "Supporting women and girls through skill development, confidence building and opportunities for greater independence.",
    icon: "lucide:users-round",
    image: "/assets/helpingecahother3.webp",
    highlights: ["Self-Reliance", "Skill Training", "Awareness Drives"],
    contentContext: {
      whatWeDo: [
        "Organizing skill development and vocational training workshops.",
        "Promoting self-reliance and financial independence.",
        "Conducting awareness drives regarding women's rights and health.",
        "Building confidence through leadership and community participation programs.",
      ],
      whoWeSupport: "Our initiatives empower women and girls in underserved areas, providing them with the tools and opportunities needed to achieve independence and equality.",
    },
  },
  {
    id: 3,
    slug: "skill-development-livelihood",
    titleKey: "Skill Development & Livelihood",
    defaultTitle: "Skill Development & Livelihood",
    descKey: "Creating opportunities for individuals to develop practical skills, improve employability and build sustainable livelihoods.",
    defaultDesc: "Creating opportunities for individuals to develop practical skills, improve employability and build sustainable livelihoods.",
    icon: "lucide:briefcase",
    image: "/assets/childrenneedyourhelp.webp",
    highlights: ["Vocational Training", "Career Guidance", "Job Readiness"],
    contentContext: {
      whatWeDo: [
        "Conducting vocational training in various practical trades.",
        "Providing career counseling and job readiness workshops.",
        "Fostering entrepreneurial skills to help individuals start small businesses.",
        "Partnering with local entities to create livelihood opportunities.",
      ],
      whoWeSupport: "We support youth, unemployed individuals, and marginalized community members seeking to improve their employability and secure a sustainable livelihood.",
    },
  },
  {
    id: 4,
    slug: "health-blood-donation",
    titleKey: "Health & Blood Donation",
    defaultTitle: "Health & Blood Donation",
    descKey: "Supporting health awareness, medical assistance and blood donation initiatives for people and communities in need.",
    defaultDesc: "Supporting health awareness, medical assistance and blood donation initiatives for people and communities in need.",
    icon: "lucide:heart-pulse",
    image: "/assets/helpingeachother1.webp",
    highlights: ["Blood Donation Camps", "Health Checkups", "Medical Guidance"],
    contentContext: {
      whatWeDo: [
        "Organizing voluntary blood donation camps regularly.",
        "Conducting free health checkups and medical awareness camps.",
        "Providing basic medical guidance and assistance to vulnerable groups.",
        "Creating awareness about hygiene, sanitation, and preventive healthcare.",
      ],
      whoWeSupport: "We serve individuals requiring urgent medical assistance, hospitals in need of blood reserves, and communities lacking access to basic healthcare facilities.",
    },
  },
  {
    id: 5,
    slug: "environment-protection",
    titleKey: "Environment Protection",
    defaultTitle: "Environment Protection",
    descKey: "Promoting environmental awareness and community action for a cleaner, greener and healthier future.",
    defaultDesc: "Promoting environmental awareness and community action for a cleaner, greener and healthier future.",
    icon: "lucide:tree-pine",
    image: "/assets/aboutus.webp",
    highlights: ["Tree Plantation", "Cleanliness Drives", "Eco Awareness"],
    contentContext: {
      whatWeDo: [
        "Organizing tree plantation drives across local communities.",
        "Conducting cleanliness campaigns to maintain public hygiene.",
        "Promoting eco-friendly and sustainable lifestyle practices.",
        "Raising environmental awareness among youth and students.",
      ],
      whoWeSupport: "Our environmental efforts aim to benefit the broader community by fostering a cleaner, greener, and more sustainable living environment for present and future generations.",
    },
  },
  {
    id: 6,
    slug: "community-awareness-support",
    titleKey: "Community Awareness & Support",
    defaultTitle: "Community Awareness & Support",
    descKey: "Working with communities through awareness programs, outreach activities and initiatives that encourage positive social change.",
    defaultDesc: "Working with communities through awareness programs, outreach activities and initiatives that encourage positive social change.",
    icon: "lucide:megaphone",
    image: "/assets/community1.webp",
    highlights: ["Social Outreach", "Public Seminars", "Community Welfare"],
    contentContext: {
      whatWeDo: [
        "Organizing public seminars on civic responsibilities and social issues.",
        "Conducting community outreach and welfare campaigns.",
        "Facilitating dialogue to address local community challenges.",
        "Creating support networks to empower vulnerable populations.",
      ],
      whoWeSupport: "We work with diverse community groups, particularly focusing on marginalized sections, to build awareness, unity, and resilience against social challenges.",
    },
  },
  {
    id: 7,
    slug: "food-nutrition-support",
    titleKey: "Food & Nutrition Support",
    defaultTitle: "Food & Nutrition Support",
    descKey: "Helping provide nutritious food and essential support to children, families and communities facing difficult circumstances.",
    defaultDesc: "Helping provide nutritious food and essential support to children, families and communities facing difficult circumstances.",
    icon: "lucide:utensils",
    image: "/assets/helpforfood.webp",
    highlights: ["Nutritious Meals", "Ration Distribution", "Child Nutrition"],
    contentContext: {
      whatWeDo: [
        "Distributing nutritious meals to underprivileged children and families.",
        "Organizing ration distribution drives during times of hardship.",
        "Conducting awareness sessions on balanced diets and child nutrition.",
        "Partnering with local donors to minimize food waste and maximize support.",
      ],
      whoWeSupport: "We target destitute families, slum dwellers, and malnourished children who struggle to fulfill their daily nutritional requirements.",
    },
  },
  {
    id: 8,
    slug: "volunteer-activities-events",
    titleKey: "Volunteer Activities & Events",
    defaultTitle: "Volunteer Activities & Events",
    descKey: "Creating opportunities for people to participate in social initiatives, community activities, awareness campaigns and meaningful volunteer work.",
    defaultDesc: "Creating opportunities for people to participate in social initiatives, community activities, awareness campaigns and meaningful volunteer work.",
    icon: "lucide:hand-heart",
    image: "/assets/events.webp",
    highlights: ["Youth Engagement", "Event Volunteering", "Social Impact"],
    contentContext: {
      whatWeDo: [
        "Engaging youth in meaningful social initiatives and volunteer work.",
        "Organizing charity events, fundraisers, and community gatherings.",
        "Training volunteers to lead and manage social impact projects.",
        "Fostering a sense of compassion and civic responsibility among participants.",
      ],
      whoWeSupport: "We support individuals eager to make a difference by providing them a platform to volunteer, while the ultimate beneficiaries are the communities they serve.",
    },
  },
];
