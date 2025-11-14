"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MdHome } from "react-icons/md";

export default function NotFoundPage() {
     const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="flex gap-4 text-8xl font-bold text-primaryColor">
        {["4", "0", "4"].map((num, i) => (
          <motion.span
            key={i}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: [0, -15, 0], opacity: 1 }}
            transition={{
              duration: 1,
              delay: i * 0.3,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut",
            }}
          >
            {num}
          </motion.span>
        ))}
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-6 text-2xl md:text-3xl font-semibold text-gray-800"
      >
        Oops! Page not found
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="mt-2 text-gray-600 text-center max-w-md"
      >
        The page you’re looking for doesn’t exist or has been moved.
      </motion.p>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 200 }}
        className="mt-8"
      >
        <button
         onClick={()=>router.back()}
          className="flex cursor-pointer items-center gap-2 px-6 py-3 bg-primaryColor text-white rounded-xl shadow-md hover:bg-primaryColor/90 transition-all"
        >
          <MdHome className="w-5 h-5 " />
          Back to Home
        </button>
      </motion.div>
    </div>
  );
}
