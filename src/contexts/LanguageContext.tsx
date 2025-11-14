'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContextType, LanguageProviderProps } from '../types';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);


export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguageState] = useState<string>('en');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize language from localStorage or i18n
  useEffect(() => {
    const storedLang = localStorage.getItem('lang');
    const initialLang = storedLang || i18n.language || 'en';
    setCurrentLanguageState(initialLang);
  }, [i18n.language]);

  const setCurrentLanguage = (lang: string) => {
    
    setIsLoading(true);
    setCurrentLanguageState(lang);
    localStorage.setItem('lang', lang);
    
    // Change i18n language
    i18n.changeLanguage(lang).then(() => {
     
      setIsLoading(false);
    });
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
