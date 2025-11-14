"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  IoLocationSharp,
  IoCalendarSharp,
} from "react-icons/io5";
import {
  FaRegCheckCircle,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaVimeoV } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import FadeUpCard from "@/src/animations/FadeButtomUp";
import LeaveComment from "../comments/LeaveComment";
import { capitalizeWords } from "../../../helper/CapitalizeWords";
import Comments from "../comments/Comments";

interface props{
  data?:any
  id:string
}
const SingleBlogDetails = ({data,id}:props)=> {
  const { t } = useTranslation();
  const { title, description, createdAt, quote, quoteAuthor, location, summary, keyPoints, tags, images, } = data || {};

  const formattedDate = useMemo(() => {
    return createdAt
      ? new Intl.DateTimeFormat("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(new Date(createdAt))
      : "";
  }, [createdAt]);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-white font-sans text-gray-green"
    >
      <div className="">
        <FadeUpCard delay={0.3}>
          {images?.[0] && (
            <div className="relative w-full h-[250px] sm:h-[300px] lg:h-[500px] xl:h-[550px] mb-6 rounded-3xl overflow-hidden">
              <Image
                src={images[0]}
                alt={title || "Blog Image"}
                fill
                priority
                className="object-cover object-center"
               
              />
            </div>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap gap-3 md:gap-5 text-sm lg:text-lg mb-6 text-foreground">
            <span className="flex items-center gap-1">
              <IoCalendarSharp className="text-yellow" size={20} />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <IoLocationSharp className="text-yellow" size={20} />
              {location}
            </span>
          </div>

          {/* Title & Description */}
          <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold mt-8 lg:mt-12 text-dark-green mb-4 lg:mb-6 leading-tight font-nunito">
            {title}
          </h1>

          {description && (
            <p className=" tracking-wide leading-7 lg:leading-8 text-[16px] lg:text-[17px] mb-8 font-nunito">
              {capitalizeWords(description)}
            </p>
          )}

          {/* Quote */}
          {quote && (
            <div className="bg-[#EBEBEB] p-6 xl:p-10 mt-10 lg:mt-14 border-l-4 border-green">
              <p className="italic text-[16px] lg:text-[17px] font-medium text-foreground">
                "{quote}"
              </p>
              {quoteAuthor && (
                <div className="mt-4 text-sm lg:text-lg flex justify-end">
                  <span className="text-green font-semibold">― {quoteAuthor}</span>
                </div>
              )}
            </div>
          )}

          {/* Summary */}
          {summary && (
            <>
              <h2 className="text-xl md:text-3xl xl:text-4xl font-extrabold mt-6 md:mt-10 text-foreground mb-4 font-nunito">
                {t("Summary")}
              </h2>
              <p className="text-[16px] lg:text-[17px] tracking-wide leading-6 md:leading-7 lg:leading-10  mb-8 font-nunito">
                {capitalizeWords(summary)}
              </p>
            </>
          )}

          {/* Key Points */}
          {keyPoints?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 text-foreground font-bold mb-8">
              {keyPoints.map((point: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm md:text-lg font-nunito"
                >
                  <FaRegCheckCircle className="text-green text-xl" />
                  {point}
                </div>
              ))}
            </div>
          )}

          {/* Tags & Share */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-14 mb-20 gap-4">
            {/* Tags */}
            {tags?.length > 0 && (
              <div className="flex items-center flex-wrap gap-2">
                <span className="font-medium text-lg lg:text-xl text-dark-green">
                  {t("Tags")}
                </span>
                {tags.map((tag: string, index: number) => (
                  <button
                    key={index}
                    className="border px-3 py-1 text-xs hover:border-none hover:bg-yellow transition-all duration-100"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="flex items-center gap-3">
              <span className="font-medium text-lg lg:text-xl text-dark-green">
                {t("Share")}
              </span>
              <div className="flex space-x-2 gap-4">
                {[FaFacebookF, FaVimeoV, FaTwitter, FaLinkedinIn].map((IconComp, index) => (
                  <a
                    key={index}
                    href="#"
                    className="p-2 bg-gray-200 hover:bg-yellow rounded"
                  >
                    <IconComp className="text-dark-green" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </FadeUpCard>

        {/* Comments */}
        <div className="mt-7 mb-8">
          <FadeUpCard delay={0.3}>
            <Comments CommentId={id} />
          </FadeUpCard>
        </div>

        {/* Leave Comment */}
        <div className="mt-7 mb-12">
          <FadeUpCard delay={0.3}>
            <div className="w-full flex justify-center">
              <LeaveComment blogId={id} />
            </div>
          </FadeUpCard>
        </div>
      </div>
    </motion.div>
  );
}

export default SingleBlogDetails;