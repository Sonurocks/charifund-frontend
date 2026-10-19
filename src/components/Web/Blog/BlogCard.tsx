"use client";

import { motion, useAnimation } from "framer-motion";
import { FaTags, FaRegUserCircle } from "react-icons/fa";
import { FaCircleArrowRight } from "react-icons/fa6";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { BlogCardProps } from "@/src/types/web/blog";
import Image from "next/image";
import { getOptimizedImageUrl } from "@/src/utils/imageStandards";


const heartVariants = {
  idle: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  hover: {
    opacity: [0.3, 1, 0.3],
    scale: [0.8, 1.3, 0.8],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const BlogCard: React.FC<BlogCardProps> = ({ card }) => {
  const heartControls = useAnimation();
  const { t } = useTranslation();
  const router = useRouter();

  if (!card) return null;

  const { id, images, title, creator, commentCount, category } = card;

  const handleCardClick = () => {
    router.push(`/blog/${id}`);
  };

  const handleCategoryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <motion.div
      className="bg-white cursor-pointer hover:bg-green rounded-2xl h-full shadow-xl text-black hover:text-white overflow-hidden group relative transition-colors duration-500 p-5 flex flex-col"
      initial={{ y: 50, opacity: 0 }}
      whileHover="hover"
      variants={{
        initial: { y: 50, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        hover: {},
      }}
      animate={{ y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }}
      onClick={handleCardClick}
      onHoverStart={() => heartControls.start("hover")}
      onHoverEnd={() => heartControls.start("idle")}
    >
      {/* Image */}
      <div className="relative mb-4 rounded-xl overflow-hidden w-full h-[230px] md:h-[400px] lg:h-[250px] xl:h-[260px]">
        <Image
          src={getOptimizedImageUrl(images?.[0], { width: 600, quality: "auto", format: "auto" })}
          alt={title || "Blog Image"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-1"
          loading="lazy"
        />

        {category && (
          <span
            onClick={handleCategoryClick}
            className="absolute top-3 left-3 bg-dark-green hover:bg-yellow hover:text-black text-white text-sm font-medium px-5 py-2 rounded-full flex items-center gap-2 z-20"
          >
            <FaTags />
            {category}
          </span>
        )}
      </div>

      {/* Metadata */}
      <div className="flex-1 mt-3">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 md:gap-4 text-sm xl:text-base mb-3 font-medium text-gray-600 group-hover:text-white">
          {creator && (
            <span className="flex items-center gap-2">
              <FaRegUserCircle className="text-yellow" size={15} />
              {creator}
            </span>
          )}
          <span className="flex items-center gap-2">
            <Icon icon="fa6-solid:comments" width={17} className="text-yellow" />
            {t("comments")} ({commentCount ?? 0})
          </span>
        </div>

        <h3 className="text-lg xl:text-xl font-bold text-dark-green font-nunito group-hover:text-white leading-snug hover:text-white">
          {title}
        </h3>
      </div>

      {/* Footer: Read More + Heart Animation */}
      <div className="flex items-center mt-4 p-2 gap-2 relative">
        <span className="text-sm xl:text-lg font-semibold underline text-gray-900 group-hover:text-white flex items-center gap-2">
          {t("Read More")}
          <FaCircleArrowRight className="text-lg text-green group-hover:text-yellow" />
        </span>

        <motion.div
          className="sm:static sm:translate-y-0 sm:ml-auto top-0 right-0 relative pointer-events-none z-20"
          variants={heartVariants}
          initial="idle"
          animate={heartControls}
        >
          <img src="/assets/heart.webp" alt="heart" className="w-16 h-10" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
