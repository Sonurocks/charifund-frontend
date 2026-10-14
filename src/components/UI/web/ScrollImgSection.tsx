"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { FaInstagram } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { usePublicGallery } from "@/src/hooks/web/useGallery";

export default function ScrollImgSection() {
  const { data, isLoading, isError } = usePublicGallery();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [iconHover, setIconHover] = useState<number | null>(null);
  const controls = useAnimation();

  const galleryImages = useMemo(() => {
    if (!data?.images || !Array.isArray(data.images)) return [];
    return data.images.filter((img) => Boolean(img?.imageUrl));
  }, [data?.images]);

  // Ensure enough items to create a seamless infinite loop
  const displayImages = useMemo(() => {
    if (galleryImages.length === 0) return [];
    let list = [...galleryImages];
    while (list.length < 8) {
      list = list.concat(galleryImages);
    }
    return list;
  }, [galleryImages]);

  const loopImages = useMemo(() => {
    if (displayImages.length === 0) return [];
    return displayImages.concat(displayImages);
  }, [displayImages]);

  const duration = useMemo(() => {
    return Math.max(16, displayImages.length * 2.5);
  }, [displayImages.length]);

  useEffect(() => {
    if (loopImages.length === 0) return;

    if (hoveredIndex === null) {
      controls.start({
        x: ["0%", "-50%"],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: duration,
            ease: "linear",
          },
        },
      });
    } else {
      controls.stop();
    }
  }, [hoveredIndex, controls, loopImages.length, duration]);

  // Hide section when loading, error, or no gallery images exist
  if (isLoading || isError || galleryImages.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden bg-gray-100">
      <motion.div
        animate={controls}
        className="flex whitespace-nowrap relative"
      >
        {loopImages.map((img, idx) => (
          <div
            key={`${img.id || img._id || img.imageUrl}-${idx}`}
            className="relative flex-shrink-0 w-72 h-72 cursor-pointer"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative w-72 h-72 overflow-hidden">
              <Image
                src={img.imageUrl}
                alt={img.altText || `YUWA India Gallery image ${idx + 1}`}
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
              />
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <a
                href="https://www.instagram.com/yuwaaindia/"
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto"
                aria-label={img.altText || "Visit YUWA India on Instagram"}
              >
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
                          color: "#000000",
                        }
                      : {
                          scale: 0,
                          opacity: 0,
                          backgroundColor: "#ffc107",
                          color: "#000000",
                        }
                  }
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="p-3 rounded-full text-3xl shadow-lg flex items-center justify-center"
                >
                  <FaInstagram />
                </motion.div>
              </a>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
