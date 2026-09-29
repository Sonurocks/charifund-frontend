"use client";
import Image from "next/image";
import Button from "../../UI/web/Buttons/Button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { imageBottomTear } from "@/public/assets";
import { useTranslation } from "react-i18next";
import Link from "next/link";

const ChildrenNeed = () => {
  const {t} = useTranslation();
  const router = useRouter();

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <div>
          <section className="relative overflow-hidden min-h-[40vh] sm:min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] ">
          <div className="relative flex items-center justify-center min-h-[40vh] sm:min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] w-full ">
          <div className="absolute inset-0 bg-cover bg-center bg-[url('/assets/childrenneedyourhelp.webp')]  transform scale-[1.6] origin-bottom transition-transform duration-500 ease-in-out"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-dark-green via-dark-green/98 to-black/5 max-w-5xl    transparent overflow-hidden"></div>
          <motion.div
            className="absolute left-0 top-[-20] bottom-0 h-180 w-80 md:w-140 overflow-hidden"
            animate={{ y: [20, -60, 20] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src="/assets/shape-left.webp"
              alt="shape left"
              fill
              className="object-cover pointer-events-none select-none overflow-hidden"
               loading="lazy"
            />
          </motion.div>

          <div className="w-full  px-4 py-32 text-center text-white relative z-20">
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <i className="text-xl mr-2 text-[#ffc107] hand-icon"></i>
              <span className="text-yellow font-caveat text-xl md:text-2xl font-semibold">
                {t("Together for a Better Society")}
              </span>
              <p className="text-3xl sm:text-3xl md:text-[40px] max-w-2xl xl:max-w-3xl mx-auto xl:text-[55px] font-extrabold text-white mb-3 sm:mb-4 font-nunito leading-snug">
                {t("Every Child Deserves a Better Future")}
              </p>
              <p className="text-[17px] sm:text-[19px] md:text-[20px] text-white/80 w-full max-w-[580px] mx-auto font-nunito font-normal leading-[1]">
                {t("Support education, nutrition, healthcare, and opportunities for children in need.")}
              </p>
            </motion.div>

            <div className="flex justify-center items-center gap-4 mt-6 sm:mt-10">
              <div className="flex items-center justify-center flex-wrap gap-3">
                <div className="text-white bg-black/30 transparent  rounded-full  ">
                <Link href="/campaign">
                  <Button
                    text={t("Know More")}
                    bgColor="bg-transparent"
                    textColor="text-white"
                    hoverTextColor="group-hover:text-black"
                    hoverBg="before:bg-[#FFC107]"
                  />
                </Link>
                </div>

                <div className="">
                  <Button
                    text={t("Join Us")}
                    bgColor="bg-[#FFC107]"
                    textColor="text-black"
                    hoverTextColor="group-hover:text-white"
                    hoverBg="before:bg-[#046b59]"
                    // className="w-[100px] h-[60px]"
                    onClick={() => router.push("/contact")}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-[-43] left-0 w-full h-19 pointer-events-none select-none">
            <Image
              src={imageBottomTear}
              alt="bottom shape"
              fill
              className="object-cover"
               loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChildrenNeed;
