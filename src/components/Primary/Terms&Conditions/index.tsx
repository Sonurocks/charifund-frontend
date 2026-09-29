'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import PageBanner from '@/src/helper/PageBanner';
import { termsAndConditions } from '@/public/assets';
import { termsSections } from '@/src/static-resource/web';

export default function TermsAndConditionsPage() {
  const { t } = useTranslation();
  return (
    <>
      {/* Page Banner */}
      <PageBanner title={t('Terms & Conditions')} bgImage={termsAndConditions} />

      {/* Main Content */}
      <section className="min-h-screen bg-white text-gray-800 px-4 sm:px-10 md:px-20 lg:px-32 py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto space-y-10"
        >
          {termsSections.map((section) => (
            <div key={section.id} className="bg-gray-50 rounded-xl ">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {`${section.id}. `}{t(section.title)}
              </h2>
              <p className="text-gray-700 leading-relaxed">{t(section.content)}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Footer CTA */}
      <section className="bg-white border-t border-gray-200 py-12 mt-8">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-xl font-medium text-gray-800 mb-2">{t("Questions about our terms?")}</h3>
          <p className="text-gray-600">
            {t("Contact us at")}{" "}
            <a href="mailto:yuwaaindia@gmail.com" className="text-green-700 font-medium hover:underline">
              yuwaaindia@gmail.com
            </a>{" "}
            {t("and we’ll get back to you shortly.")}
          </p>
        </div>
      </section>
    </>
  );
}
