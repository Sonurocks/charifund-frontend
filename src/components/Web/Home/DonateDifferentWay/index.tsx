'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { gridDot, donatediffway } from '@/public/assets';
import { donateDifferentWayMissionItems, donateDifferentWayVisionText, donateDifferentWayCommitmentText, donateDifferentWayTabs } from '@/src/static-resource/web';
import ComponentTitle from '@/src/components/UI/web/ComponentTitle';
import { FaHandHoldingHeart } from 'react-icons/fa';
import Link from 'next/link';

const DonateDifferentWay: React.FC = () => {
  const [activeTab, setActiveTab] = useState('mission');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const mainImageRef = useRef(null);
  const bottomImageRef = useRef(null);
  const isInView = useInView(mainImageRef, { once: true, amount: 0.3 });
  const isBottomImageInView = useInView(bottomImageRef, { once: true, amount: 0.3 });
  const { t } = useTranslation();
  const tabs = donateDifferentWayTabs;
  
  const currentItems = donateDifferentWayMissionItems;

  const headerRef = useRef(null);

  return (
    <div className='w-full py-4 sm:py-6 lg:py-2 px-0 -mt-2 sm:-mt-1 md:mt-2 lg:mt-25 mb-10 xl:mb-20 bg-white '>
      <div className='max-w-7xl px-4 sm:px-6 md:px-8 lg:px-8 xl:pr-18 mx-auto'>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 xs:gap-6 sm:gap-8 lg:gap-20 w-full items-start'>
          {/* Left side - Video and image section (xl+ only) */}
          <div className='hidden xl:block xl:col-span-5 space-y-3 xl:mt-20 h-full relative'>

            {/* Grid background pattern */}
            <motion.div
              className='hidden xl:block absolute  top-0 left-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-35 lg:h-30 z-0 -mt-12 sm:-mt-16 lg:-mt-20 -ml-8 sm:-ml-12 lg:-ml-15'
              animate={{
                y: [-2, -30, -2]
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror"
              }}
            >
              <Image
                src={gridDot}
                alt='Grid pattern'
                fill={true}
                className='w-full h-full rounded-t-full rounded-b-full  object-contain opacity-60'
              />
            </motion.div>

            {/* Image Wrapper for stable overlapping */}
            <div className='relative w-full max-w-sm sm:max-w-md lg:w-110 xl:w-[450px] lg:-ml-40 xl:-ml-0 lg:-mt-13'>
              {/* Video player with actual image */}
              <motion.div
                ref={mainImageRef}
                className='hidden xl:block relative rounded-xl sm:rounded-2xl overflow-hidden w-full h-64 sm:h-80 xl:h-[610px] bg-gray-200 z-10'
                initial={{ opacity: 0, x: -100 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 1,
                  ease: "easeOut",
                  delay: 0.2,
                }}
              >
                <Image
                  src={donatediffway}
                  alt="Children in need"
                  fill={true}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div
                  className="absolute inset-0 
                 bg-[linear-gradient(104deg,rgba(12,26,23,0)_1.9%,rgba(0,113,93,.08)_18.93%,rgba(0,113,93,.17)_29.72%,rgba(0,113,93,.37)_83.58%,rgba(0,113,93,.67)_109.85%,#00715d_133.89%,#00715d_133.91%,rgba(0,113,93,.91)_149.32%)]"
                />
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
                    mixBlendMode: "overlay",
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-yellow rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-500 transition-colors shadow-lg"
                    onClick={() => setIsVideoModalOpen(true)}
                    animate={{
                      boxShadow: [
                        "rgba(0, 0, 0, 0.384) 0px 0px 0px 0px",
                        "rgba(0, 0, 0, 0.384) 0px 0px 0px 30.2903px",
                        "rgba(0, 0, 0, 0.384) 0px 0px 0px 0px",
                      ],
                    }}
                    transition={{
                      duration: 3,
                      ease: "linear",
                      delay: 2,
                      repeat: Infinity,
                    }}
                  >
                    <svg
                      className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
  
              {/* Small overlapping image */}
              <motion.div
                ref={bottomImageRef}
                className="hidden xl:block absolute rounded-2xl sm:rounded-3xl lg:rounded-4xl overflow-hidden border-4 sm:border-6 lg:border-10 border-white w-48 h-40 sm:w-56 sm:h-48 lg:w-75 lg:h-65 xl:w-[320px] xl:h-[280px] z-20 bottom-0 right-0 translate-x-[20%] translate-y-[20%] lg:translate-x-[60%] lg:translate-y-[40%] xl:translate-x-[26%] xl:translate-y-[45%]"
                initial={{ opacity: 0, y: 100 }}
                animate={isBottomImageInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <Image
                  src="/assets/helpingeachother2.webp"
                  alt="Happy child running"
                  fill={true}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>

          {/* Right side - Content section */}
          <div className='lg:col-span-12 xl:col-span-7 flex flex-col md:pl-5 lg:p-5 xl:p-0 lg:flex-row gap-4 sm:gap-6'>
            <div className='space-y-4 sm:space-y-6 flex-1 '>
              <div ref={headerRef} className='font-nunito font-extrabold relative'>

                
                <div
                  className="flex items-center mb-5  opacity-0 anim-fade-in-up"
                  style={{ animationDelay: "0.6s" }}
                >
                  <FaHandHoldingHeart className="text-lg md:text-xl mr-2 text-green" />

                  <span className="text-green font-caveat text-lg md:text-2xl lg:text-2xl font-bold">
                    {t("Together for a Better Tomorrow")}
                  </span>
                </div>
                <ComponentTitle
                  preText={t("Together, ")}
                  highlightText={t("We Can")}
                  postText={t(" Make a Difference")}
                />
                <motion.div
                  className='flex-shrink-0 absolute top-[70] md:top-[1] md:right-[2] xl:top-[-20] right-[20]  ml-2 sm:ml-4 xl:ml-0 mt-1 sm:mt-2'
                  animate={{
                    scale: [0.5, 1.2, 0.5]
                  }}
                  transition={{
                    duration: 4,
                    ease: "easeInOut",
                    repeat: Infinity
                  }}
                >
                  <div className="relative w-10 h-10 md:w-12 md:h-12">
                    <Image
                      src='/assets/spade-green-heart.webp'
                      alt='Green heart'
                      fill
                      className='object-contain'
                    />
                  </div>
                </motion.div>
              </div>

              {/* Introductory text */}
              <p className='text-gray-green text-sm sm:text-sm xl:text-[16px] lg:text-[16px] md:pr-5 lg:pl-15 lg:pr-10 xl:pl-0 xl:pr-0 leading-7  lg:leading-relaxed xl:leading-7 lg:tracking-wide xl:tracking-wide  font-nunito font-normal'>
                {t("Every act of kindness has the power to create a better tomorrow. Your support enables Youth Util Welfare Association to reach children, women and underserved communities through meaningful social welfare initiatives.")}
                <br /><br />
                {t("We work to create opportunities, strengthen communities and bring positive change through education, healthcare, skill development, nutrition, environmental protection and community support.")}
              </p>
              <div className='flex flex-col md:flex-row lg:pl-5 lg:pr-5 xl:pl-0 xl:pr-0 md:gap-4 lg:gap-2 xl:gap-2'>
                <div className='flex-1 min-w-0'>
                  {/* Tabbed Navigation */}
                  <div className='flex flex-nowrap md:gap-2 xl:gap-4 justify-center md:mr-2 border-b border-gray-200 mx-auto mt-6 xs:mt-4 xl:mt-10 pb-4 overflow-x-auto hide-scrollbar sm:overflow-visible'>
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`whitespace-nowrap px-6 py-2.5 sm:px-6 sm:py-3 lg:px-4 xl:px-8 font-nunito rounded-full text-[14px] sm:text-[15px] xl:text-[16px] font-bold cursor-pointer transition-colors duration-400 flex-1 sm:flex-none ${activeTab === tab.id
                          ? 'bg-green text-white'
                          : 'text-foreground hover:bg-green hover:text-white'
                          }`}
                      >
                        {t(tab.label)}
                      </button>
                    ))}
                  </div>

                  <div className='flex flex-col cursor-pointer md:flex-row md:pl-2 xl:mt-5 mt-2 xs:mt-7 lg:mt-0  lg:py-3 lg:px-8  xl:p-2'>
                    <div className='flex-1 cursor-pointer'>
                      {activeTab === 'mission' && (
                        <div className='space-y-3 sm:space-y-4'>
                          <ul className='space-y-2 sm:space-y-3'>
                            {currentItems.map((item, index) => {
                              const splitIndex = item.indexOf(' - ');
                              const title = splitIndex !== -1 ? item.substring(0, splitIndex) : item;
                              const desc = splitIndex !== -1 ? item.substring(splitIndex + 3) : '';
                              return (
                                <li key={index} className='flex items-start space-x-2 sm:space-x-2'>
                                  <div className='w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center flex-shrink-0 mt-0.5'>
                                    <svg className='w-4 h-4 xl:w-6 xl:h-6 text-yellow' fill='currentColor' viewBox='0 0 24 24' strokeWidth='3' stroke='currentColor'>
                                      <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' strokeWidth='3' />
                                    </svg>
                                  </div>
                                  <span className='text-[#696969] flex flex-wrap text-sm xl:text-[15px] lg:text-[15px] font-medium font-nunito md:font-semibold'>
                                    <strong className="text-foreground mr-1">{t(title)}</strong>
                                    {desc ? t(desc) : ''}
                                  </span>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )}
                      
                      {activeTab === 'vision' && (
                        <div className='space-y-3 sm:space-y-4 pt-2'>
                          <p className='text-[#696969] text-sm md:text-[16px] leading-7 font-nunito font-medium'>
                            {t(donateDifferentWayVisionText)}
                          </p>
                        </div>
                      )}
                      
                      {activeTab === 'commitment' && (
                        <div className='space-y-3 sm:space-y-4 pt-2'>
                          <p className='text-[#696969] text-sm md:text-[16px] leading-7 font-nunito font-medium'>
                            {t(donateDifferentWayCommitmentText)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Right side - Donation Area */}
                <div className='h-fit md:self-start flex flex-wrap xs:flex-row sm:flex-row md:flex-col gap-4 xl:gap-2 rounded-xl md:w-2/6 lg:w-[250px] xl:w-[250px] lg:mr-2 xl:mr-0 xl:mt-5 bg-gray-50 border border-gray-300'>
                  <div className='p-6 sm:p-3 flex-1 flex flex-col items-center justify-center min-h-[300px] rounded-xl'>
                    <div className='w-14 h-14 sm:w-16 sm:h-16 lg:w-24 lg:h-24 xl:w-22 xl:h-22 rounded-xl flex items-center justify-center mb-6 sm:mb-5'>
                      <Image
                        src='/assets/icon2.webp'
                        alt='Donate icon'
                        width={120}
                        height={120}
                        className='w-full h-full object-contain'
                      />
                    </div>
                    <h3 className='text-dark-green font-extrabold mb-3 font-nunito text-[18px] md:text-[20px] xl:text-[22px] lg:text-[24px] text-center'>
                      {t("Support Our Mission")}
                    </h3>
                    <p className='text-[15px] md:text-[15px] leading-relaxed font-semibold text-center font-nunito text-gray-500 mb-6'>
                      {t("Your Support Can Create Real Change.")}
                    </p>
                    <Link 
                      href="/donate-us" 
                      className='font-nunito font-bold text-green mt-auto text-[15px] hover:text-dark-green hover:underline focus:underline transition-colors'
                    >
                      {t("Donate Now")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* YouTube Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground bg-opacity-75 p-2 sm:p-4">
          <div className="relative w-full max-w-4xl bg-foreground rounded-lg overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-900">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-sm sm:text-base">Introduction to React.js</h3>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button className="text-white hover:text-gray-300 hidden sm:block">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                  </svg>
                </button>
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  className="text-white hover:text-gray-300"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Video Container */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/YE7VzlLtp-4?si=0UwTlJoWAMUgT34S&autoplay=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 bg-gray-900 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button className="flex items-center space-x-1 sm:space-x-2 text-white hover:text-gray-300">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span className="text-xs sm:text-sm">Watch on YouTube</span>
                </button>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button className="text-white hover:text-gray-300 hidden sm:block">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                </button>
                <span className="text-white text-xs sm:text-sm">0:00 / 1:19:10</span>
                <button className="text-white hover:text-gray-300 hidden sm:block">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                  </svg>
                </button>
                <button className="text-white hover:text-gray-300 hidden sm:block">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </button>
                <button className="text-white hover:text-gray-300 hidden sm:block">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonateDifferentWay;

