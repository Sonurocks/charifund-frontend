"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { ServiceItem } from "@/src/static-resource/services";
import AnimatedReveal from "@/src/animations/AnimatedReveal";
import ComponentTitle from "@/src/components/UI/web/ComponentTitle";
import ComponentLabel from "@/src/components/UI/web/ComponentLabel";
import Button from "@/src/components/UI/web/Buttons/Button";
import PageBanner from "@/src/helper/PageBanner";
import ServiceCard from "./ServiceCard";

interface ServiceDetailProps {
  service: ServiceItem;
  relatedServices: ServiceItem[];
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, relatedServices }) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="w-full bg-white font-nunito overflow-hidden">
      {/* --------------------------------------------------
          HERO / BANNER
      -------------------------------------------------- */}
      <PageBanner
        bgImage={service.image}
        title={service.titleKey}
        tagline="Our Services"
        description={service.descKey}
      />

      {/* --------------------------------------------------
          CONTENT SECTION
      -------------------------------------------------- */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-8 xl:px-28 bg-white relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <AnimatedReveal direction="up" distance={30}>
              <ComponentLabel text={t("About This Initiative")} isVisible={true} />
              <ComponentTitle
                preText={t("Our Mission in ") + t(service.titleKey)}
                highlightText=""
                postText=""
              />
              <p className="text-gray-green text-base sm:text-lg leading-relaxed mt-6 mb-10 font-nunito">
                {t(service.descKey) + " " + t("Through our dedicated efforts, we aim to uplift and empower individuals to sustain a healthier, independent and self-sufficient life.")}
              </p>
            </AnimatedReveal>

            {/* What We Do */}
            <AnimatedReveal direction="up" distance={30} delay={0.1}>
              <h3 className="text-2xl font-extrabold text-dark-green mb-6 font-nunito flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow/20 flex items-center justify-center shrink-0">
                  <Icon icon={service.icon} className="w-5 h-5 text-dark-green" />
                </div>
                {t("What We Do")}
              </h3>
              <div className="space-y-4 mb-10 pl-2">
                {service.contentContext.whatWeDo.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <Icon icon="lucide:check-circle-2" className="w-6 h-6 text-green shrink-0 mt-0.5" />
                    <p className="text-gray-green text-base sm:text-md leading-relaxed font-nunito">
                      {t(item)}
                    </p>
                  </div>
                ))}
              </div>
            </AnimatedReveal>

            {/* Who We Support */}
            <AnimatedReveal direction="up" distance={30} delay={0.2}>
              <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 sm:p-8">
                <h3 className="text-xl font-extrabold text-dark-green mb-4 font-nunito flex items-center gap-2">
                  <Icon icon="lucide:users" className="w-5 h-5 text-green shrink-0" />
                  {t("The Communities We Serve")}
                </h3>
                <p className="text-gray-green text-base sm:text-md leading-relaxed font-nunito">
                  {t(service.contentContext.whoWeSupport)}
                </p>
              </div>
            </AnimatedReveal>
          </div>

          {/* Sidebar / Get Involved */}
          <div className="lg:col-span-4">
            <AnimatedReveal direction="up" distance={30} delay={0.3}>
              <div className="sticky top-28 bg-dark-green rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
                  <Icon icon="lucide:heart-handshake" className="w-8 h-8 text-yellow" />
                </div>

                <h3 className="text-2xl font-extrabold text-white mb-4 font-nunito relative">
                  {t("Support Our Cause")}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed mb-8 font-nunito relative">
                  {t("Your contribution makes a direct impact on the lives of those who need it most. Join hands with us to drive positive change.")}
                </p>

                <div className="space-y-4 relative">
                  <Button
                    text={t("Donate Now")}
                    bgColor="bg-yellow"
                    textColor="text-foreground text-sm font-extrabold w-full justify-center"
                    hoverBg="before:bg-white"
                    onClick={() => router.push("/donate-us")}
                  />
                  <Button
                    text={t("Become a Volunteer")}
                    bgColor="bg-white/10"
                    textColor="text-white text-sm font-extrabold w-full justify-center"
                    hoverBg="before:bg-yellow"
                    hoverTextColor="group-hover:text-foreground"
                    onClick={() => router.push("/volunteer")}
                  />
                </div>
              </div>

              {/* Back to services */}
              <div className="mt-8 text-center flex justify-center">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-sm font-bold text-dark-green hover:text-green transition-colors"
                >
                  <Icon icon="lucide:arrow-left" className="w-4 h-4" />
                  {t("Explore All Services")}
                </Link>
              </div>
            </AnimatedReveal>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------
          RELATED SERVICES
      -------------------------------------------------- */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-8 xl:px-28 bg-gray-50/60 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center">
            <AnimatedReveal direction="up" distance={30}>
              <h2 className="text-3xl md:text-4xl font-extrabold text-dark-green font-nunito">
                {t("Explore More Initiatives")}
              </h2>
            </AnimatedReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {relatedServices.map((related, idx) => (
              <AnimatedReveal key={related.id} direction="up" distance={30} delay={0.1 * idx}>
                <ServiceCard service={related} />
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
