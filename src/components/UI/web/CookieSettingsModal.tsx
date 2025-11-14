"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    const dismissedAt = localStorage.getItem("cookie_dismissed_at");

    // ✅ Only show if no consent AND not on cookie-policy page
    if (!consent && pathname !== "/cookie-policy") {
      if (dismissedAt) {
        const timePassed = Date.now() - Number(dismissedAt);
        // 3 hours = 10800000 ms
        if (timePassed > 10800000) {
          setVisible(true);
          localStorage.removeItem("cookie_dismissed_at");
        }
      } else {
        setVisible(true);
      }
    } else {
      setVisible(false);
    }
  }, [pathname]);

  const handleAccept = () => {
    localStorage.setItem(
      "cookie_consent",
      JSON.stringify({
        necessary: true,
        analytics: true,
        functional: true,
        marketing: true,
        timestamp: new Date().toISOString(),
      })
    );
    localStorage.removeItem("cookie_dismissed_at");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(
      "cookie_consent",
      JSON.stringify({
        necessary: true,
        analytics: false,
        functional: false,
        marketing: false,
        timestamp: new Date().toISOString(),
      })
    );
    localStorage.removeItem("cookie_dismissed_at");
    setVisible(false);
  };

  const handleDismiss = () => {
    // Save dismiss timestamp → will show again after 3 hours
    localStorage.setItem("cookie_dismissed_at", Date.now().toString());
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-white/90 backdrop-blur-md text-gray-800 shadow-xl rounded-2xl p-6 z-[9999] border border-gray-200"
        >
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-gray-500 hover:text-black cursor-pointer"
            aria-label="Close cookie banner"
          >
            <X size={20} />
          </button>

          <p className="text-sm leading-relaxed mb-4">
            By clicking <strong>"Accept Cookies"</strong>, you agree to our{" "}
            <a
              href="/privacy-policy"
              className="text-green-700 font-medium hover:underline"
            >
              privacy policy
            </a>{" "}
            and storing of cookies on your device to enhance site navigation,
            analyze site usage, and assist in marketing efforts.
          </p>

          <p className="text-sm mb-6">
            Want to know more? Check out our{" "}
            <a
              href="/cookie-policy"
              className="text-green-700 font-medium hover:underline"
            >
              cookies policy
            </a>
            .
          </p>

          <div className="flex flex-wrap gap-3 justify-end">
            <button
              onClick={handleAccept}
              className="px-5 py-2 cursor-pointer bg-green-600 text-white font-semibold text-sm rounded-lg hover:bg-green-700 transition-all"
            >
              Accept Policies
            </button>
            <button
              onClick={handleDecline}
              className="px-5 py-2 cursor-pointer bg-gray-800 text-white font-semibold text-sm rounded-lg hover:bg-gray-900 transition-all"
            >
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
