"use client";

import { Provider } from "react-redux";
import { store } from "@/src/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { Toaster } from "react-hot-toast";

import LanguageProviders from "./languageProvider";
import { LanguageProvider } from "../contexts/LanguageContext";
import I18nProvider from "./I18nProvider";
import Loader from "../components/UI/web/Loader";
import Header from "../components/Web/Header";
import Footer from "../components/Web/Footer";
import CustomCursor from "../components/Web/CustomCursor/CustomCursor";
import LanguageInitializer from "../components/UI/web/LanguageSwitcher/LanguageInitializer";
import ClientRedirect from "../middleware/clientMiddleware";

export default function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");
  const noHeaderFooterRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  const hideHeaderFooter = noHeaderFooterRoutes.includes(pathname);

  // Show loader on route change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [pathname]);

  const showLayout = !token;

  return (
    <LanguageInitializer>
      <I18nProvider>
        <LanguageProviders>
          <LanguageProvider>
            <Provider store={store}>
              <QueryClientProvider client={queryClient}>
                <ClientRedirect />
                {showLayout ? (
                  <>
                    {!hideHeaderFooter && (
                      <header>
                        <Header />
                      </header>
                    )}
                    <main>{loading ? <Loader /> : children}</main>
                    {!hideHeaderFooter && (
                      <footer>
                        <Footer />
                      </footer>
                    )}
                  </>
                ) : (
                  loading ? <Loader /> : children
                )}

                <CustomCursor />
                <Toaster
                  position="top-center"
                  toastOptions={{ duration: 3000 }}
                />
              </QueryClientProvider>
            </Provider>
          </LanguageProvider>
        </LanguageProviders>
      </I18nProvider>
    </LanguageInitializer>
  );
}
