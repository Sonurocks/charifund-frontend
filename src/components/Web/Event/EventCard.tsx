"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Image from "next/image";


interface EventCardProps {
  event: any;
  large?: boolean;
  index?: number;
}

export default function EventCard({ event, large = false, index = 0 }: EventCardProps) {
  return (
    <motion.div
      key={event.id}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative w-full overflow-hidden rounded-xl  ${
        large
          ? "h-[400px] sm:h-[500px] lg:h-[700px]"
          : "h-[200px] sm:h-[250px] lg:h-full bg-black"
      } ${index ? `card-stagger-${index + 2}` : ""}`}
    >
      {/* Full card clickable */}
      <Link href={`/events/${event.id}`} className="absolute inset-0 z-0" aria-label={event.title} >
      <Image
        src={event.image}
        alt={event.title}
        className="absolute inset-0 w-full h-full object-cover rounded-xl"
        fill={true}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

      {/* Text overlay */}
      <div
        className={`absolute text-white font-nunito font-extrabold animate-slide-up-delay z-10 ${
          large
            ? "bottom-6 left-4 sm:left-6 w-full text-center"
            : "bottom-4 left-4 sm:left-6 max-w-[350px] lg:max-w-[300px]"
        }`}
      >
        <span className={`${large ? "text-base lg:text-lg" : "text-base lg:text-sm"}`}>
          {event.date}
        </span>
        <h3
          className={`font-bold leading-snug ${
            large ? "text-lg sm:text-2xl lg:text-5xl" : "text-lg sm:text-2xl lg:text-[34px]"
          }`}
        >
          <Link href={`/events/${event.id}`}>{event?.title}</Link>
        </h3>
        <p
          className={`flex items-center justify-${large ? "center" : "start"} gap-2 ${
            large ? "text-sm lg:text-lg" : "text-base lg:text-base"
          }`}
        >
          <Icon icon="ion:location" width="20" height="20" className="text-white" />
          {event.location}
        </p>
      </div>
      </Link>
    </motion.div>
  );
}
