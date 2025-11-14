"use client";

import React, { useRef, useEffect, } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useAnimation, useInView, Variants } from "framer-motion";
import { FaFacebookF, FaVimeoV, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { CircleCheckBig } from "lucide-react";
import Button from "../../UI/web/Buttons/Button";
import { useTranslation } from "react-i18next";
import { useFetchSingleMember } from "@/src/hooks/web/useMembers";

export const SocialIcon = ({ url, Icon }: { url: string; Icon: any }) => (
  <motion.a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 bg-white border border-gray-200 rounded-full text-green hover:bg-green hover:text-white transition-all duration-300"
  >
    <Icon size={18} />
  </motion.a>
);


const TeamMemberDetails: React.FC<{ id: string }> = ({ id }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();
  const { data: memberData, isLoading: isLoading } = useFetchSingleMember(id as string);
  console.log(memberData)

  // --- Animation trigger when section is visible ---
  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  // --- Animation Variants ---
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } },
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut", delay: 0.2 } },
  };

  const aboutVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut", delay: 0.4 } },
  };

  const featureVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <motion.section
      ref={ref}
      className="w-full flex justify-center items-center py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6 lg:px-8"
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      <div className="w-11/12 xl:w-10/11  mt-8 sm:mt-12 md:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 font-nunito items-start">
          {/* --- Image Section --- */}
          <motion.div className="flex justify-center w-full" variants={imageVariants}>
            <div className="relative rounded-2xl overflow-hidden w-full md:h-[600px]">
              <div className="relative w-full aspect-[4/5]">

                <Image
                  src={memberData?.image}
                  alt={memberData?.name || "Volunteer"}
                  width={534}
                  height={639}
                  className="rounded-2xl object-cover w-full h-full"
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* --- Text Section --- */}
          <motion.div className="mt-2 sm:mt-0" variants={textVariants}>
            <div className="w-full px-2  sm:px-0">

              <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-2">
                {memberData?.name}
              </h2>
              <p className="text-base text-gray-secondary mb-6">{memberData?.position}</p>

              {/* Social Icons */}
              <div className="flex flex-wrap gap-3 mb-6">
                {memberData?.facebookUrl && <SocialIcon url={memberData?.facebookUrl} Icon={FaFacebookF} />}
                {memberData?.vimeoUrl && <SocialIcon url={memberData?.vimeoUrl} Icon={FaVimeoV} />}
                {memberData?.twitterUrl && <SocialIcon url={memberData?.twitterUrl} Icon={FaTwitter} />}
                {memberData?.linkedInUrl && <SocialIcon url={memberData?.linkedInUrl} Icon={FaLinkedinIn} />}
              </div>

              {/* About */}
              {!isLoading && (
                <p className="text-gray-secondary mb-6 text-[16.5px]   leading-7 tracking-wide  capitalize">
                  {memberData?.description}
                </p>
              )}

              {/* Tagline */}
              {!isLoading && (
                <h3 className="text-black  text-lg sm:text-xl lg:text-2xl mb-6 font-extrabold leading-snug">
                 {memberData?.title}
                </h3>
              )}

              {/* Key Points */}
              <h4 className="text-black text-[22px] mb-4 font-extrabold leading-snug">
                {t("Key Points")}
              </h4>
              <motion.div
                className="grid gap-3 sm:gap-4 mb-8 grid-cols-1 sm:grid-cols-2"
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
              >
                {memberData?.keyPoints?.map((text:string, index: number) => (
                  <motion.p
                    key={index}
                    custom={index}
                    variants={featureVariants}
                    className="flex items-center gap-2 font-bold text-sm sm:text-base "
                  >
                    <CircleCheckBig className="text-green w-4 h-4 flex-shrink-0" />
                    <span>{text}</span>
                  </motion.p>
                ))}
              </motion.div>

              {/* Donate Button */}
              <div className="w-fit mt-8">
                <Button
                  text={t("Donate With Me")}
                  bgColor="bg-yellow py-5"
                  textColor="text-black font-bold"
                  hoverTextColor="group-hover:text-white"
                  hoverBg="before:bg-green"
                  onClick={() => router.push("/donate-us")}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- About Section --- */}
        {memberData?.about && (
          <motion.div
            className="mt-10 sm:mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={aboutVariants}
          >
            <div >
              <h3 className="text-2xl lg:text-3xl font-extrabold mb-4 text-left font-nunito">
                {t("About Me")}
              </h3>
              <p className="text-gray-secondary text-[16.5px]  leading-7 tracking-wide text-left capitalize">
                {memberData?.about}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default TeamMemberDetails;

