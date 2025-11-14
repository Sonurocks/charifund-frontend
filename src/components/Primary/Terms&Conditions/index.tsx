// pages/terms-and-conditions.tsx
'use client'
import React from 'react';
import Head from 'next/head';
import PageBanner from '@/src/helper/PageBanner';
import { termsAndConditions } from '@/public/assets';
import { useTranslation } from 'react-i18next';
import { termsSections} from '@/src/staticResource';

export default function TermsAndConditionsPage() {
  const{t}=useTranslation();
  return (
    <>
        <PageBanner title={t('Terms & Condtions')} bgImage={termsAndConditions} />

      {/* Main Content */}
      <section className="bg-gray-50 py-5 lg:py-16 lg:px-4">
        <div className="max-w-5xl mx-auto space-y-2 lg:space-y-12">
          {termsSections.map((section) => (
            <div
              key={section.id}
              className="bg-white lg:shadow-lg rounded-xl px-4 py-4 md:px-8 md:py-8 transition-transform duration-300 hover:scale-[1.02]"
            >
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-4">
                {`${section.id}. `}{t(section.title)}
              </h2>
              <p className="text-gray-700 leading-relaxed">{t(section.content)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-white border-t border-gray-200 py-12 lg:mt-10">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-xl font-medium text-gray-800">{t("Questions about our terms?")}</h3>
          <p className="text-gray-600 mt-2">
            {t("Contact us at")}{" "}
            <a href="mailto:support@example.com" className="text-blue-600 underline">
              support@example.com
            </a>{" "}
            {t("and we’ll get back to you shortly.")}
          </p>
        </div>
      </section>
    </>
  );
}
