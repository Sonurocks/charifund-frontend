// pages/privacy-policy.tsx
'use client'
import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next'
import { privacyPolicySections } from '@/src/staticResource';

export default function PrivacyPolicyPage() {
  const{t}=useTranslation();
  return (
    <>
      {/* Main Content */}
      <section className="bg-gray-50 py-5 lg:py-16 lg:px-4">
        <div className="max-w-5xl mx-auto space-y-2 lg:space-y-0">
          {privacyPolicySections.map((section) => (
            <div
              key={section.id}
              className="bg-white  rounded-xl px-4 py-4 md:px-8 md:py-5 "
            >
              <h2 className=" text-xl lg:text-2xl font-semibold text-gray-800 mb-4 ">{t(section.title)}</h2>
              <p className="text-gray-700 leading-relaxed">{t(section.content)}</p>
              {section.list && (
                <ul className="list-disc pl-6 mt-4 space-y-0 text-base  text-gray-700">
                  {section?.list.map((item, index) => (
                    <li key={index}>{t(item)}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-white border-t border-gray-200 py-12 lg:mt-10">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-xl font-medium text-gray-800">{t("Still have questions?")}</h3>
          <p className="text-gray-600 mt-2">
            {t("Contact our support team at")}{" "}
            <a href="mailto:support@example.com" className="text-blue-600 underline">
              support@example.com
            </a>{" "}
            {t("and we’ll be happy to help.")}
          </p>
        </div>
      </section>
    </>
  );
}
