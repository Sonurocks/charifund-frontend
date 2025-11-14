"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Trans, useTranslation } from "react-i18next";

const CookiePolicy = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const COOKIE_KEY = "charifund_cookie_consent";

  const [alreadyAccepted, setAlreadyAccepted] = useState(false);

  // ✅ Check if user already accepted cookies
  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (consent) {
      try {
        const parsed = JSON.parse(consent);
        if (parsed?.necessary && parsed?.analytics) {
          setAlreadyAccepted(true);
        }
      } catch {
        setAlreadyAccepted(false);
      }
    }
  }, []);

  const handleAcceptPolicy = () => {
    localStorage.setItem(
      COOKIE_KEY,
      JSON.stringify({
        necessary: true,
        analytics: true,
        functional: true,
        marketing: true,
        timestamp: new Date().toISOString(),
      })
    );
    setAlreadyAccepted(true);
    router.push("/");
  };

  // ✅ Keep i18n listener for reactivity
  useEffect(() => {
    const handleLanguageChange = () => {};
    i18n.on("languageChanged", handleLanguageChange);
    return () => i18n.off("languageChanged", handleLanguageChange);
  }, [i18n]);

  return (
    <section className="min-h-screen bg-white text-gray-800 px-6 sm:px-10 md:px-20 lg:px-32 py-16">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Page Title */}
        <h1 className="text-4xl font-bold mb-6">{t("Cookie Policy")}</h1>

        {/* Intro Paragraph */}
        <p className="text-base leading-7 mb-6 text-gray-700">
          <Trans
            i18nKey="This Cookie Policy explains how <1>Charifund</1> uses cookies and similar technologies on our website. By using our site, you consent to the use of cookies as described in this policy."
            components={{ 1: <strong /> }}
          />
        </p>

        {/* What Are Cookies */}
        <h2 className="text-2xl font-semibold mb-3">{t("What Are Cookies?")}</h2>
        <p className="text-base mb-6 text-gray-700">
          {t(
            "Cookies are small text files stored on your device when you visit a website. They help us enhance user experience, analyze website traffic, and deliver personalized content or ads."
          )}
        </p>

        {/* Types of Cookies */}
        <h2 className="text-2xl font-semibold mb-3">{t("Types of Cookies We Use")}</h2>
        <div className="space-y-5 mb-8">
          <div>
            <h3 className="text-xl font-semibold">{t("1. Necessary Cookies")}</h3>
            <p className="text-gray-700">
              {t(
                "These cookies are essential for the website to function correctly. They enable basic features like page navigation and access to secure areas. The website cannot function properly without these cookies."
              )}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">{t("2. Functional Cookies")}</h3>
            <p className="text-gray-700">
              {t(
                "Functional cookies allow us to remember your preferences and provide enhanced, more personalized features such as language selection and saved donation details."
              )}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">{t("3. Analytics & Marketing Cookies")}</h3>
            <p className="text-gray-700">
              {t(
                "These cookies help us understand user behavior, measure website performance, and deliver relevant marketing campaigns. You can manage these cookies in your browser or via the cookie settings."
              )}
            </p>
          </div>
        </div>

        {/* Managing Cookies */}
        <h2 className="text-2xl font-semibold mb-3">{t("Managing Cookies")}</h2>
        <p className="text-base mb-6 text-gray-700">
          <Trans
            i18nKey="You can manage or disable cookies through your browser settings. However, disabling certain cookies may affect your experience on our website. You can also update your preferences at any time using the <1>Cookie Settings</1> link in the footer."
            components={{ 1: <span className="font-semibold hover:underline" /> }}
          />
        </p>

        {/* Updates Section */}
        <h2 className="text-2xl font-semibold mb-3">{t("Updates to This Policy")}</h2>
        <p className="text-base mb-6 text-gray-700">
          {t(
            "We may update this Cookie Policy periodically to reflect changes in our practices or for other operational, legal, or regulatory reasons. Please review this page regularly for updates."
          )}
        </p>

        {/* Last Updated */}
        <p className="text-base text-gray-600 mb-10">
          <strong>{t("Last Updated: October 2025")}</strong>
        </p>

        {/* Accept Button */}
        {!alreadyAccepted && (
          <div className="text-center mb-10">
            <button
              onClick={handleAcceptPolicy}
              className="px-6 py-3 cursor-pointer bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
            >
              {t("Accept Cookie Policy")}
            </button>
          </div>
        )}

        {/* Footer CTA */}
        <div className="text-center border-t border-gray-200 pt-10 mt-10">
          <h3 className="text-xl font-medium text-gray-800 mb-2">{t("Still have questions?")}</h3>
          <p className="text-gray-600">
            {t("Contact our support team at")}{" "}
            <a
              href="mailto:support@charifund.org"
              className="text-green-700 font-medium hover:underline"
            >
              support@charifund.org
            </a>{" "}
            {t("and we’ll be happy to help.")}
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default CookiePolicy;
