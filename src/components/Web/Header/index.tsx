'use client';

import React, { useEffect } from 'react';
import InfoBar from './InfoBar';
import Navbar from './Navbar';
import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setNavScrolled } from '@/src/store/slice/navScrollSlice';
import type { RootState } from '@/src/store';

const Header = () => {
  const dispatch = useDispatch();
  const scrolled = useSelector((state: RootState) => state.navScroll.navScrolled);
  const scrolledRef = React.useRef(scrolled);

  React.useEffect(() => {
    scrolledRef.current = scrolled;
  }, [scrolled]);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      const isScrolled = offset > 80;
      if (isScrolled !== scrolledRef.current) {
        scrolledRef.current = isScrolled;
        dispatch(setNavScrolled(isScrolled));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch]);

  return (
    <div className="relative z-40 bg-background">
      <div>
        <InfoBar />
        {/* Static Navbar - always preserves height in document flow to prevent scroll collapse */}
        <div
          className={`transition-opacity duration-300 px-2 md:px-3 ${
            scrolled ? 'invisible pointer-events-none' : 'opacity-100'
          }`}
        >
          <Navbar />
        </div>
      </div>

      <AnimatePresence>
        {scrolled && (
          <motion.div
            key="scrolled-navbar"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 px-2 md:px-3"
          >
            <Navbar />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
