import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FiPlus } from "react-icons/fi";
import { motion, useAnimation, useInView } from "framer-motion";

import { SocialBar } from "../../UI/web/SocialBar";
import { VolunteerCardProps } from "@/src/types/web/members";
import { useRouter } from "next/navigation";

export const VolunteerCard: React.FC<VolunteerCardProps> = ({ member, idx }) => {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const inView = useInView(ref, { margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (inView) controls.start({ opacity: 1, y: 0 });
  }, [inView, controls]);

  const bgClass = isHovered ? "bg-dark-green" : "bg-[#f1f0ee]";
  const nameColor = isHovered ? "text-white" : "text-black";
  const roleColor = isHovered ? "text-yellow-400" : "text-black";


  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 0.8, delay: member.delay || idx * 0.2, ease: "easeOut" }}
      className="relative rounded-lg transition-all duration-300 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative w-full aspect-[5/6] cursor-pointer overflow-hidden"
        onClick={() => window.location.href = `/team/${member.id}`}
      >
        <Image
          src={member.image || "/assets/volunteer1.webp"}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-0 left-0 right-0 h-1/2"
        />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={(isHovered || (isMobileOrTablet && showSocial)) ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute bottom-4 right-2 z-20 flex flex-col gap-2 pb-4"
        >
          <SocialBar member={member} />
        </motion.div>
      </div>

      <div className={`relative h-28 p-8 flex flex-col items-start transition-all duration-500 ${bgClass}`}>
        <h6 className={`font-extrabold font-nunito text-dark-green text-md xl:text-xl transition-colors duration-300 cursor-pointer ${nameColor}`} onClick={() => { router.push(`/volunteer/${member.id}`) }}>
          {member.name}
        </h6>
        <p className={`text-sm font-nunito font-semibold mt-2 text-dark-green transition-colors duration-300 ${roleColor}`}>
          {member.position}
        </p>

        <button
          className={`absolute top-[-22px] right-4 w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 overflow-visible ${isHovered || (isMobileOrTablet && showSocial) ? "bg-yellow-400 text-black" : "bg-black text-white"
            }`}
          onClick={(e) => {
            e.stopPropagation();
            if (isMobileOrTablet) {
              setShowSocial((prev) => !prev);
            }
          }}
        >
          <span
            className={`inline-block transition-transform duration-300 ${isHovered || (isMobileOrTablet && showSocial) ? "rotate-45" : ""
              }`}
          >
            <FiPlus size={24} />
          </span>
        </button>
      </div>
    </motion.div>
  );
};