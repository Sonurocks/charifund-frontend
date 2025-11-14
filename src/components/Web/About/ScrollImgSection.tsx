"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaInstagram } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8 } from "@/public/assets";

const images = [
  photo1,
  photo2,
  photo3,
  photo4,
  photo5,
  photo6,
  photo7,
  photo8,
  photo1,
  photo2,
  photo3,
  photo4,
  photo5,
  photo6,
  photo7,
  photo8,
];

export default function ScrollImgSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [iconHover, setIconHover] = useState<number | null>(null);
  const controls = useAnimation();

  useEffect(() => {
    if (hoveredIndex === null) {
      controls.start({
        x: ["0%", "-50%"],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 8,
            ease: "linear",
          },
        },
      });
    } else {
      controls.stop();
    }
  }, [hoveredIndex, controls]);

  return (
    <div className="relative w-full overflow-hidden bg-gray-100 ">
      <motion.div animate={controls} className="flex whitespace-nowrap relative">
        {images.concat(images).map((src, idx) => (
          <div
            key={idx}
            className="relative flex-shrink-0 w-72 h-72 cursor-pointer"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative w-72 h-72 overflow-hidden">
              <Image
                src={src}
                alt={`Image ${idx + 1}`}
                 loading="lazy"
                width={288}
                height={288}
                className={`object-cover w-full h-full transition-transform duration-300 ${
                  hoveredIndex === idx ? "scale-110" : "scale-100"
                }`}
              />
              <div
                className={`absolute top-0 left-0 w-full h-full bg-black/40 transition-transform duration-500 ${
                  hoveredIndex === idx ? "translate-y-0" : "-translate-y-full"
                }`}
              ></div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                onMouseEnter={() => setIconHover(idx)}
                onMouseLeave={() => setIconHover(null)}
                initial={{ scale: 0, opacity: 0 }}
                animate={
                  hoveredIndex === idx
                    ? {
                        scale: 1,
                        opacity: 1,
                        backgroundColor:
                          iconHover === idx ? "#ffffff" : "#ffc107",
                        color: iconHover === idx ? "#000000" : "#000000",
                      }
                    : { scale: 0, opacity: 0, backgroundColor: "#ffc107", color: "#000000" }
                }
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="p-3 rounded-full text-3xl shadow-lg flex items-center justify-center pointer-events-auto"
              >
                <FaInstagram />
              </motion.div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}



