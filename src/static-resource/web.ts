import {
  FaEnvelope,
  FaFacebookF,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaShareAlt,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import {
  charityLife,
  heartCare,
  loremIpsum,
  theBird,
  treeLife,
  photo1,
  photo2,
  photo3,
  photo4,
} from "../../public/assets";
import {
  CharityCard,
  DonationCardData,
  InfoItem,
  SocialMediaButton,
} from "../types";
import { FAQItem } from "../types/web/faq";

export const socialIcons = [
  {
    icon: "fa6-brands:facebook-f",
    label: "Facebook",
    link: "https://www.facebook.com/yuwaaindia",
  },
  {
    icon: "fa6-brands:instagram",
    label: "Instagram",
    link: "https://www.instagram.com/yuwaaindia",
  },
  {
    icon: "fa6-brands:whatsapp",
    label: "WhatsApp",
    link: "https://wa.me/918565006669",
  },
  {
    icon: "fa6-brands:youtube",
    label: "YouTube",
    link: "https://www.youtube.com/@yuwaindiaofficial",
  },
];

export const footerData = {
  brand: {
    name: "Charifund",
    description:
      "Youth Util Welfare Association is a non-profit organization working for child welfare, education, women empowerment, skill development, healthcare, environmental protection, and community development.",
    socials: [
      {
        icon: "fa6-brands:facebook-f",
        label: "Facebook",
        link: "https://www.facebook.com/yuwaaindia",
      },
      {
        icon: "fa6-brands:instagram",
        label: "Instagram",
        link: "https://www.instagram.com/yuwaaindia",
      },
      {
        icon: "fa6-brands:whatsapp",
        label: "WhatsApp",
        link: "https://wa.me/918565006669",
      },
      { icon: "fa6-brands:linkedin-in", label: "LinkedIn", link: "#" },
    ],
  },
  quickLinks: [
    { label: "About Us", href: "/about" },
    { label: "Our Team", href: "/team" },
    { label: "Our Campaigns", href: "/campaign" },
    { label: "Our Projects", href: "#" },
    { label: "Our Blog", href: "/blog" },
    { label: "Volunteer With Us", href: "/volunteer" },
    { label: "Donate", href: "/donate-us" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
  ],
  services: [
    { label: "Child Education & Welfare", href: "#" },
    { label: "Women Empowerment", href: "#" },
    { label: "Skill Development", href: "#" },
    { label: "Healthcare & Blood Donation", href: "#" },
    { label: "Environmental Protection", href: "#" },
    { label: "Community Development", href: "#" },
    { label: "Nutrition & Food Support", href: "#" },
    { label: "Awareness & Support Campaigns", href: "#" },
  ],
  contact: {
    address:
      "Head Office: H.No. RZC-13, Kh. No. 72/23, 78/3, Nihal Vihar, Nangloi, New Delhi-110041, India\n\nBranch Office: Behind Sankat Mochan Hanuman Mandir, Azad Nagar Colony East, Taramandal Road, Rustampur, Gorakhpur, Uttar Pradesh-273016, India",
    phone_label: "+91 8565006669",
    phone_number: "+918565006669",
    email: "yuwaaindia@gmail.com",
    website: "yuwaindia.org",
  },
  bottomLinks: [
    { label: "Terms & Conditions", href: "/term-and-conditions" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Cookie Settings", href: "/cookie-policy" },
  ],
};

export const PartnersCompaniesData = [
  { src: theBird.src, alt: "The Bird" },
  { src: treeLife.src, alt: "Tree Life" },
  { src: loremIpsum.src, alt: "Lorem Ipsum" },
  { src: charityLife.src, alt: "Charity Life" },
  { src: heartCare.src, alt: "Heart Care" },
  { src: theBird.src, alt: "The Bird" },
  { src: treeLife.src, alt: "Tree Life" },
  { src: loremIpsum.src, alt: "Lorem Ipsum" },
  { src: charityLife.src, alt: "Charity Life" },
  { src: heartCare.src, alt: "Heart Care" },
];

export const faqData: FAQItem[] = [
  {
    question: "What kind of recipes can I find on your website?",
    answer:
      "It is a long established fact that a reader will be distracted by the readable the a content of a page when looking at its layout. Many desktop publishing packages and web page editors.",
  },
  {
    question: "Are the recipes suitable for beginners?",
    answer:
      "It is a long established fact that a reader will be distracted by the readable the a content of a page when looking at its layout. Many desktop publishing packages and web page editors.",
  },
  {
    question: "Do you offer cooking tips and techniques?",
    answer:
      "It is a long established fact that a reader will be distracted by the readable the a content of a page when looking at its layout. Many desktop publishing packages and web page editors.",
  },
  {
    question: "How frequently you update you recipe collection?",
    answer:
      "It is a long established fact that a reader will be distracted by the readable the a content of a page when looking at its layout. Many desktop publishing packages and web page editors.",
  },
];

// donate us page data

export const GalleryImage = [
  { src: photo1, className: "col-span-1 lg:col-span-2" },
  { src: photo2 },
  { src: photo3 },
  { src: photo4, className: "col-span-1 lg:col-span-2" },
];

export const Donationmethods = [
  { label: "Online Payment", value: "online" },
  { label: "Offline Donation", value: "offline" },
];

export const VolunteerPage = {
  subtitle: "Become A Volunteer",
  title: "Volunteer Requirements",
  description:
    "Sed Ut Perspiciatis Unde Omnis Iste Natus Error Sit Voluptatem Accusantium Doloremque Laudantium, Totam Rem Aperiam, Eaque Inventore",
};

export const VolunteerNotice = {
  icon: "mdi:alert",
  title: "Notice",
  message:
    "Test Mode Is Enabled. While In Test Mode No Live Donations Are Processed.",
};

export const VolunteerProgress = [
  { label: "Donation Collect", value: 70 },
  { label: "Successful Events", value: 85 },
];

export const VolunteerFeatures = [
  { text: "Best Quality Services" },
  { text: "Time Saving" },
  { text: "Meet The Deadlines" },
  { text: "24/7 Customer Support" },
];

export const charityCards: CharityCard[] = [
  {
    id: 1,
    title: "Child Education & Welfare",
    description:
      "Supporting children through education, care, learning opportunities, and welfare initiatives.",
    icon: "\e829",
    image: "/yellow_bg.webp",
    color: "border-yellow-500",
    bgColor: "bg-yellow-50",
  },
  {
    id: 2,
    title: "Women Empowerment",
    description:
      "Empowering women and girls through awareness, training, skills, and opportunities for self-reliance.",
    icon: "\e82a",
    image: "/blue_bg.webp",
    color: "border-green-600",
    bgColor: "bg-gray-100",
  },
  {
    id: 3,
    title: "Youth Empowerment",
    description:
      "Empowering youth through leadership, confidence, social participation, and development opportunities.",
    icon: "\e82b",
    image: "/green_bg.webp",
    color: "border-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    id: 4,
    title: "Skill Development",
    description:
      "Providing practical skills and vocational training to promote employment and self-reliance.",
    icon: "\e82a",
    image: "/blue_bg.webp",
    color: "border-yellow-500",
    bgColor: "bg-yellow-50",
  },
  {
    id: 5,
    title: "Healthcare & Blood Donation",
    description:
      "Promoting health awareness and supporting voluntary blood donation and healthcare initiatives.",
    icon: "\e82b",
    image: "/green_bg.webp",
    color: "border-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    id: 6,
    title: "Nutrition & Food Support",
    description:
      "Providing nutritional and food support to underprivileged children, families, and communities.",
    icon: "\e82a",
    image: "/blue_bg.webp",
    color: "border-green-600",
    bgColor: "bg-gray-100",
  },
  {
    id: 7,
    title: "Environmental Protection",
    description:
      "Promoting environmental awareness, cleanliness, plantation, and sustainable community practices.",
    icon: "\e829",
    image: "/yellow_bg.webp",
    color: "border-yellow-500",
    bgColor: "bg-yellow-50",
  },
  {
    id: 8,
    title: "Awareness & Social Support",
    description:
      "Creating awareness and providing social support for community welfare and inclusive development.",
    icon: "\e82a",
    image: "/blue_bg.webp",
    color: "border-green-600",
    bgColor: "bg-gray-100",
  },
];

// DonateDifferentWay component data
export const donateDifferentWayTabs = [
  { id: "mission", label: "Our Mission" },
  { id: "vision", label: "Our Vision" },
  { id: "commitment", label: "Our Commitment" },
];

export const donateDifferentWayMissionItems = [
  "Child Education & Welfare - Creating opportunities for children to learn, grow and build a better future.",
  "Women Empowerment & Skill Development - Supporting women and girls through skill development, training and livelihood opportunities.",
  "Healthcare & Blood Donation - Promoting healthcare awareness and supporting voluntary blood donation initiatives.",
  "Nutrition & Food Support - Extending food and nutritional support to people and communities in need.",
  "Environmental Protection - Encouraging environmental awareness, plantation and sustainable community practices.",
  "Awareness & Community Support - Organising awareness campaigns and community initiatives for social development and public welfare.",
];

export const donateDifferentWayVisionText =
  "To build an inclusive, empowered and compassionate society where every child, every woman and every person in need gets an opportunity to live with dignity, learn, grow and thrive.";

export const donateDifferentWayCommitmentText =
  "We are committed to serving society with compassion, transparency and responsibility, while working together with volunteers, donors and communities to create sustainable social impact.";

export const donationCards: DonationCardData[] = [
  {
    id: 1,
    image: "/assets/helpforeducation.webp",
    category: "Food",
    title: "Help For Education",
    description:
      "Lorem Ipsum Dolor Sit Amet, Consete Sadipscing Elitr, Sed Diam Nonum",
    progress: 90,
    raised: "$8500",
    goal: "$1,0000",
  },
  {
    id: 2,
    image: "/assets/helpforfood.webp",
    category: "Health",
    title: "Help For Food",
    description:
      "Lorem Ipsum Dolor Sit Amet, Consete Sadipscing Elitr, Sed Diam Nonum",
    progress: 75,
    raised: "$8500",
    goal: "$1,0000",
  },
  {
    id: 3,
    image: "/assets/givehealthsupport.webp",
    category: "Food",
    title: "Give Health Support",
    description:
      "Lorem Ipsum Dolor Sit Amet, Consete Sadipscing Elitr, Sed Diam Nonum",
    progress: 65,
    raised: "$8500",
    goal: "$1,0000",
  },
  {
    id: 4,
    image: "/assets/childenweworkfor.webp",
    category: "Health",
    title: "Children We Work ",
    description:
      "Lorem Ipsum Dolor Sit Amet, Consete Sadipscing Elitr, Sed Diam Nonum",
    progress: 85,
    raised: "$8500",
    goal: "$1,0000",
  },
];
export const donationCardsBig: DonationCardData[] = [
  {
    id: 1,
    image: "/assets/childenweworkfor.webp",
    category: "Health",
    title: "Children We Work ",
    description:
      "Lorem Ipsum Dolor Sit Amet, Consete Sadipscing Elitr, Sed Diam Nonum",
    progress: 85,
    raised: "$8500",
    goal: "$1,0000",
  },
  {
    id: 2,
    image: "/assets/helpforeducation.webp",
    category: "Food",
    title: "Help For Education",
    description:
      "Lorem Ipsum Dolor Sit Amet, Consete Sadipscing Elitr, Sed Diam Nonum",
    progress: 70,
    raised: "$8500",
    goal: "$1,0000",
  },
  {
    id: 3,
    image: "/assets/helpforfood.webp",
    category: "Health",
    title: "Help For Food",
    description:
      "Lorem Ipsum Dolor Sit Amet, Consete Sadipscing Elitr, Sed Diam Nonum",
    progress: 65,
    raised: "$8500",
    goal: "$1,0000",
  },
  {
    id: 4,
    image: "/assets/givehealthsupport.webp",
    category: "Food",
    title: "Give Health Support",
    description:
      "Lorem Ipsum Dolor Sit Amet, Consete Sadipscing Elitr, Sed Diam Nonum",
    progress: 90,
    raised: "$8500",
    goal: "$1,0000",
  },
  {
    id: 5,
    image: "/assets/childenweworkfor.webp",
    category: "Health",
    title: "Children We Work ",
    description:
      "Lorem Ipsum Dolor Sit Amet, Consete Sadipscing Elitr, Sed Diam Nonum",
    progress: 75,
    raised: "$8500",
    goal: "$1,0000",
  },
  {
    id: 6,
    image: "/assets/helpforeducation.webp",
    category: "Food",
    title: "Help For Education",
    description:
      "Lorem Ipsum Dolor Sit Amet, Consete Sadipscing Elitr, Sed Diam Nonum",
    progress: 65,
    raised: "$8500",
    goal: "$1,0000",
  },
  {
    id: 7,
    image: "/assets/helpforfood.webp",
    category: "Health",
    title: "Help For Food",
    description:
      "Lorem Ipsum Dolor Sit Amet, Consete Sadipscing Elitr, Sed Diam Nonum",
    progress: 90,
    raised: "$8500",
    goal: "$1,0000",
  },
  {
    id: 8,
    image: "/assets/givehealthsupport.webp",
    category: "Food",
    title: "Give Health Support",
    description:
      "Lorem Ipsum Dolor Sit Amet, Consete Sadipscing Elitr, Sed Diam Nonum",
    progress: 55,
    raised: "$8500",
    goal: "$1,0000",
  },
];

// Create 8 cards by repeating the original 4
export const allDonationCards = [...donationCards, ...donationCards];

export const filterFields = [
  { label: "Select filter", value: "none" },
  { label: "Viewed Status", value: "isViewed" },
  { label: "Form Type", value: "formType" },
];
export const CategoryfilterFields = [
  { label: "Select filter", value: "none" },
  { label: "Name", value: "name" },
];

export const isViewedOptions = [
  { label: "All", value: "all" },
  { label: "Viewed", value: "true" },
  { label: "Not Viewed", value: "false" },
];

export const formTypeOptions = [
  { label: "All", value: "all" },
  { label: "Contact", value: "contact" },
  { label: "Detail", value: "detail" },
  { label: "Donation", value: "donation" },
  { label: "Volunteer", value: "volunteer" },
];

export const filterOptions = [
  { label: "All", value: "all" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Pending", value: "pending" },
];

// Event Detail Page Data

export const socialMediaButtons: SocialMediaButton[] = [
  { icon: "FaFacebookF", bg: "#4267B2", label: "Facebook" },
  { icon: "FaWhatsapp", bg: "#25D366", label: "WhatsApp" },
  { icon: "FaPinterest", bg: "#E60023", label: "Pinterest" },
  { icon: "FaYoutube", bg: "#FF0000", label: "YouTube" },
  { icon: "FaInstagram", bg: "#C13584", label: "Instagram" },
];

export const defaultEventData = {
  title: "Give African Childrens A Good Education",
  date: "02 Apr 2021",
  location: "684 West College St. Sun City, USA",
  image: "/assets/poster 2.webp",
  summary:
    "Charity And Donation Is A Categorys That Involves Giving Financial Category That Involves Giving Financial Or Material Support Various Causes Organizations. It Allows Individuals Towards The A Addressing Social Category That Involves Giving Financial Or Material Support Various Causes Of Organizations. It Allows Individuals Towards Addressing Social",
  keyPoints: [
    "Empower Through Charity",
    "Giving Hope, Changing Lives",
    "Healing Communities",
    "Together We Can",
    "Compassion In Action",
    "Every Act Counts",
  ],
};

export const googleMapsEmbedUrl =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976378252907!3d40.69766374874312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2588f046ee661%3A0xa0b3281fcecc08c!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1716298418080!5m2!1sen!2sin";

export const SocialMedia = [
  {
    label: "Facebook",
    icon: FaFacebookF,
    href: "https://www.facebook.com/yuwaaindia",
    getShareUrl: (url: string, title?: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title || "")}`,
  },
  {
    label: "WhatsApp",
    icon: FaWhatsapp,
    href: "https://wa.me/918565006669",
    getShareUrl: (url: string, title?: string) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(title || "")}%20${encodeURIComponent(url)}`,
  },
  {
    label: "YouTube",
    icon: FaYoutube,
    href: "https://www.youtube.com/@yuwaaindiaofficial",
    getShareUrl: (url: string, title?: string) => ``, // YouTube does not have a direct share URL
  },
  {
    label: "Instagram",
    icon: FaInstagram,
    href: "https://www.instagram.com/yuwaaindia",
  },
];

export const contactInfo: InfoItem[] = [
  {
    icon: FaMapMarkerAlt,
    title: "Location",
    lines: ["55 main street, 2nd block,", "Melbourne, Australia"],
    links: [
      "https://www.google.com/maps/search/?api=1&query=55+main+street,+Melbourne,+Australia",
    ],
  },
  {
    icon: FaPhoneAlt,
    title: "Phone",
    lines: ["+91 85650 06669"],
    links: ["tel:+918565006669"],
  },
  {
    icon: FaEnvelope,
    title: "Email",
    lines: ["yuwaaindia@gmail.com"],
    links: ["mailto:yuwaaindia@gmail.com"],
  },
  {
    icon: FaShareAlt,
    title: "Social",
    isSocial: true,
  },
];
export const termsSections = [
  {
    id: 1,
    title: "Introduction",
    content:
      "Welcome to our website. These Terms and Conditions govern your use of our platform. By accessing or using our services, you agree to comply with these terms. Please read them carefully before proceeding.",
  },
  {
    id: 2,
    title: "Use of the Site",
    content:
      "You agree to use the site for lawful purposes only and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use of the site. Prohibited behavior includes harassing or causing distress to any person, transmitting obscene or offensive content, or disrupting normal flow of dialogue.",
  },
  {
    id: 3,
    title: "Intellectual Property",
    content:
      "All content on this website, including text, graphics, logos, and images, is the property of the company or its licensors and is protected by copyright and intellectual property laws. You may not reproduce, distribute, or exploit any content without prior written permission.",
  },
  {
    id: 4,
    title: "User Accounts",
    content:
      "If you create an account on our platform, you are responsible for maintaining the confidentiality of your login information and for all activities that occur under your account.",
  },
  {
    id: 5,
    title: "Limitation of Liability",
    content:
      "We are not liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services, even if we have been advised of the possibility of such damages.",
  },
  {
    id: 6,
    title: "Termination",
    content:
      "We reserve the right to terminate or suspend your access to our website or services at any time, without notice, for conduct that we believe violates these Terms and Conditions or is harmful to other users or the business.",
  },
  {
    id: 7,
    title: "Changes to These Terms",
    content:
      "We may modify these Terms and Conditions from time to time. Any changes will be effective immediately upon posting. Continued use of the site indicates your acceptance of the updated terms.",
  },
  {
    id: 8,
    title: "Contact Us",
    content:
      "If you have any questions about these Terms and Conditions, please contact us at yuwaaindia@gmail.com. We are here to help and provide clarity where needed.",
  },
];

export const privacyPolicySections = [
  {
    id: 1,
    title: "1. Introduction",
    heading: "Our Commitment to Your Privacy",
    banner: "Privacy Policy",
    content:
      "Your privacy matters to us. This Privacy Policy explains how we collect, use, and protect your personal information when you engage with our website or services. By accessing our platform, you agree to the terms described below. We encourage you to read this policy carefully to understand how your information is handled.",
  },
  {
    id: 2,
    title: "2. Information We Collect",
    content:
      "We collect both personal and non-personal information to improve your experience and ensure smooth operation of our website. This may include:",
    list: [
      "Personal details such as your name, email address, and phone number.",
      "Information submitted through forms, surveys, or sign-up processes.",
      "Usage data, including IP address, browser type, and pages visited.",
      "Cookies and similar tracking technologies to enhance site performance.",
    ],
  },
  {
    id: 3,
    title: "3. How We Use Your Information",
    content:
      "The data we collect allows us to provide a seamless experience, improve our content, and communicate effectively with you. We use your information to:",
    list: [
      "Respond to inquiries, feedback, or service requests.",
      "Personalize and improve user experience on our platform.",
      "Send important updates, newsletters, or promotional materials (only if you opt-in).",
      "Monitor and analyze usage patterns to enhance website performance.",
    ],
  },
  {
    id: 4,
    title: "4. Data Protection",
    content:
      "We prioritize the security of your personal data. All information is stored using secure servers and protected by appropriate administrative, technical, and physical safeguards. While we strive to ensure the highest level of security, please note that no method of electronic storage or transmission over the internet is 100% secure.",
  },
  {
    id: 5,
    title: "5. Sharing Your Information",
    content:
      "We do not sell or rent your personal data to third parties. However, we may share limited information with trusted partners or service providers who help us operate our website or deliver services — always under strict confidentiality agreements and only for legitimate business purposes.",
  },
  {
    id: 6,
    title: "6. Your Rights",
    content:
      "You have full control over your personal information. You may request access, correction, or deletion of your data at any time. You can also choose to unsubscribe from our emails or withdraw consent where applicable.",
  },
  {
    id: 7,
    title: "7. Changes to This Policy",
    content:
      "We may update this Privacy Policy periodically to reflect changes in our practices or for other operational, legal, or regulatory reasons. Any modifications will be posted on this page with an updated revision date.",
  },
  {
    id: 8,
    title: "8. Contact Us",
    content:
      "If you have any questions, concerns, or requests related to this Privacy Policy, please contact us at yuwaaindia@gmail.com. We are here to ensure your experience with us remains safe, transparent, and respectful of your privacy.",
  },
];
