'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { LanguageSwitcherProps } from '@/src/types';

const dropdownVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const languages = [
  { code: 'en', label: 'English', icon: 'twemoji:flag-united-kingdom' },
  { code: 'hi', label: 'हिंदी', icon: 'twemoji:flag-india' },
];

const LanguageSwitcher = ({
  rounded = 'rounded-full',
  paddingx = 'px-4',
  paddingy = 'py-4',
}: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  const { setCurrentLanguage } = useLanguage();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Initial selectedLang (still fine as fallback)
  const [selectedLang, setSelectedLang] = useState(
    languages.find((lang) => lang.code === i18n.language) || languages[0]
  );

  // Update selectedLang if i18n.language changes
  useEffect(() => {
    const lang = languages.find((l) => l.code === i18n.language);
    if (lang) setSelectedLang(lang);
  }, [i18n.language]);

  // Optionally load from localStorage on mount
  useEffect(() => {
    const storedLang = localStorage.getItem('lang');
    if (storedLang && storedLang !== i18n.language) {
      i18n.changeLanguage(storedLang);
      document.documentElement.dir = 'ltr';
    }
  }, []);


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (lng: 'en' | 'hi') => {
   
    
    // Update language context
    setCurrentLanguage(lng);
    
    // Update i18n
    i18n.changeLanguage(lng);
    document.documentElement.dir = 'ltr';
    
    // Update local state
    setSelectedLang(languages.find((lang) => lang.code === lng)!);
    setOpen(false);
    
    // Invalidate all queries to refetch data with new language
   
    queryClient.invalidateQueries();
    
   
  };

  return (
    <div className="relative inline-block z-40" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-2 cursor-pointer bg-yellow text-foreground text-sm shadow-md hover:shadow-lg transition-all ${rounded} ${paddingx} ${paddingy}`}
      >
        <span className="flex items-center gap-2">
          <Icon icon={selectedLang.icon} className="w-5 h-5" />
          {selectedLang.label}
        </span>
        <Icon icon={open ? 'mdi:chevron-up' : 'mdi:chevron-down'} className="text-base" />
      </button>

      {/* Dropdown List */}
      <AnimatePresence>
        {open && (
          <motion.ul
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="absolute bg-white rounded-md shadow-lg overflow-hidden text-gray-800 mt-2"
          >
            {languages.map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => changeLanguage(lang.code as 'en' | 'hi')}
                  className={`w-full cursor-pointer px-4 py-3 flex items-center gap-2 text-left text-sm hover:bg-gray-200 transition-colors ${i18n.language === lang.code ? 'font-bold bg-yellow/40' : ''
                    }`}
                >
                  <Icon icon={lang.icon} className="w-5 h-5" />
                  {lang.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
