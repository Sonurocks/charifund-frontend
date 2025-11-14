"use client";

import FadeInUp from "@/src/animations/FadeInUp";
import { GalleryImage } from "@/src/staticResource";

import Image from "next/image";
import { useRef } from "react";

const Gallery = () => {
  const ref = useRef(null);
  return (
    <section ref={ref} className=" py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {GalleryImage.map((img, i) => (
          <FadeInUp
            key={i}
            className={`overflow-hidden rounded-2xl ${img.className || ""}`}
          >
            <Image
              src={img.src}
              alt={`gallery-${i}`}
              width={600}
              height={400}
              className="w-full h-full object-cover"
               loading="lazy"
            />
          </FadeInUp>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
