"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MdHome } from "react-icons/md";

interface EmptyStateProps {
  title?: string;
  description?: string;
  imageSrc?: string;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Nothing to show here",
  description = "There is currently no data available.",
  imageSrc = "/assets/empty-state.png",
  className = "",
}) => {
  const router = useRouter();

  return (
    <div className={` w-full flex flex-col md:flex-row items-center justify-center text-center ${className}`}>
      {imageSrc && (
        <div className="relative h-50 w-full md:h-80 md:w-120 lg:h-100 lg:w-170 xl:w-200 xl:h-130">

          <Image
            src={imageSrc}
            fill
            alt="Empty State Illustration"
            className="object-fit mb-6 rounded"
          />
        </div>
      )}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mt-8 flex flex-col gap-4 justify-center items-center lg:px-4"
      >
        <h2 className="text-2xl md:text-5xl font-bold mb-2 text-yellow">{title}</h2>
        <p className="text-gray-500 text-base md:text-xl">{description}</p>
        <button
          onClick={() => router.push('/')}
          className="flex cursor-pointer items-center gap-2 px-6 py-3 bg-primaryColor text-white rounded-xl shadow-md hover:bg-primaryColor/90 transition-all"
        >
          <MdHome className="w-5 h-5 " />
          Back to Home
        </button>
      </motion.div>
    </div>
  );
};

export default EmptyState;
