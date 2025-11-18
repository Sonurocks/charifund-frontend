'use client';
import { TeamMember } from "@/src/types/web/members";
import { FaBehance, FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export const SocialBar = ({ member }: { member: TeamMember }) => {
  const socials = [
    { icon: <FaFacebookF />, url: member.facebookUrl },
    { icon: <FaTwitter />, url: member.twitterUrl },
    { icon: <FaInstagram />, url: member.instagramUrl },
    { icon: <FaBehance />, url: member.behanceUrl },
  ];

  return (
    <div className="flex flex-col gap-2 p-2">
      {socials
        .filter((social) => social.url)
        .map((social, idx) => (
          <a
            key={idx}
            href={social.url!}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-12 h-12 flex items-center justify-center rounded-full shadow-md text-black bg-white hover:bg-yellow-400 transition-all duration-300 z-50"
          >
            {social.icon}
          </a>
        ))}
    </div>
  );
};