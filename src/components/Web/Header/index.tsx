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

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      dispatch(setNavScrolled(offset > 50));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch]);

  return (
    <div className="sticky top-0 z-50 bg-background transition-all duration-300">
      <div>
        <InfoBar />
        {!scrolled && (
          <div className="transition-opacity duration-300 px-2 md:px-3">
            <Navbar />
          </div>
        )}
      </div>

      <AnimatePresence>
        {scrolled && (
          <motion.div
            key="scrolled-navbar"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
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
