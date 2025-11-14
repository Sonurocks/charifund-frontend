'use client';

import React, { Suspense, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import Button from '../../../UI/web/Buttons/Button';
import { useTranslation } from 'react-i18next';
import FadeUpCard from '@/src/animations/FadeButtomUp';
import CustomLoader from '../../../UI/web/Loader/CustomLoader';
import BlogCard from '../../Blog/BlogCard';
import { useFetchAllBlogs } from '@/src/hooks/web/useBlog';
import ComponentLabel from '@/src/components/UI/web/ComponentLabel';
import ComponentTitle from '@/src/components/UI/web/ComponentTitle';

const LatestNewsArticle: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useFetchAllBlogs(1, 3, 'All');

  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  if (!isLoading && (!data?.blogs || data.blogs.length === 0)) {
    return null;
  }

  return (
    <div
      className={`w-full py-20 px-3 mt-15 relative `}
    >
      <div className="absolute inset-0">
        <div className="h-1/2 w-full bg-[url('/assets/latestNewsArticalbg.webp')] bg-cover bg-center bg-no-repeat" />
        <div className="h-1/2 w-full bg-white" />
      </div>

      <div className='max-w-7xl mx-auto relative z-10'>

        <div ref={headerRef} className='lg:text-center mb-10 relative lg:flex justify-center items-center'>
          <div className="lg:max-w-[830px]">
            <ComponentLabel
              className='md:justify-center'
              text="Start Donating Poor People"
              isVisible={isHeaderInView}
            />
            <ComponentTitle
              className='lg:justify-center'
              preText="Our Latest "
              highlightText="News"
              postText="& Articles You Like"
            />
          </div>


          {/* Animated Heart */}
          <motion.div
            className="absolute  hidden md:block top-14 md:top-90 lg:top-38 xl:top-13 xl:left-[-90] lg:left-[-25] left-[-30] z-[-1]"
            animate={{
              scale: [0.8, 1.3, 0.8],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Image
              src="/assets/yellowspade.webp"
              alt="heart"
              width={120}
              height={120}
              className="w-20 h-20 md:w-45 md:h-45"
            />
          </motion.div>
        </div>
        {/* News Cards Grid */}
        {isLoading ? <div className="flex items-center justify-center text-center"><CustomLoader /></div> : isError ? <div className="text-center flex items-center justify-center text-red">Failed to fetch blogs.</div> :
          <div className='grid grid-cols-1 md:grid-cols-1 md:px-14 lg:px-18 lg:grid-cols-2 xl:px-0 xl:grid-cols-3 gap-8 lg:gap-5' >
            <Suspense fallback={<CustomLoader />}>
              {data?.blogs?.map((card: any, i: number) => {
                return (
                  <FadeUpCard key={i} delay={i * 0.2}>
                    <BlogCard key={i} card={card} />
                  </FadeUpCard>
                )
              })}
            </Suspense>
          </div>
        }

        {/* View All Button */}
        <motion.div
          className="flex justify-center mt-11"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link href="/blog">
            <Button
              text="View All"
              bgColor="bg-yellow"
              textColor="text-foreground"
              hoverTextColor="group-hover:text-white"
              hoverBg="before:bg-green"
              paddingx="px-8 xs:px-9 lg:px-11"
              paddingy="py-4 xs:py-5"
            />
          </Link>
        </motion.div>


      </div>
    </div>
  );
};

export default LatestNewsArticle;
