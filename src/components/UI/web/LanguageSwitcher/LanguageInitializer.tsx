'use client';

import i18n from '@/src/i18n/config';
import { useEffect, useState } from 'react';

export default function LanguageInitializer({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedLang = localStorage.getItem('lang') || 'en';
    i18n.changeLanguage(storedLang).then(() => {
      document.documentElement.lang = storedLang;
      document.documentElement.dir = 'ltr';
      setReady(true);
    });
  }, []);

  if (!ready) return null; // or show a loading spinner if you want

  return <>{children}</>;
}
