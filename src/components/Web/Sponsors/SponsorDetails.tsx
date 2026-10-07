"use client";

import Image from "next/image";
import Link from "next/link";
import { Sponsor } from "@/src/types/web/sponsor";
import { Icon } from "@iconify/react";
import FadeUpCard from "@/src/animations/FadeButtomUp";
import AnimatedReveal from "@/src/animations/AnimatedReveal";
import PageBanner from "@/src/helper/PageBanner";
import { ourcausebanner } from "@/public/assets";

interface SponsorDetailsProps {
  sponsor: Sponsor;
}

const SponsorDetails = ({ sponsor }: SponsorDetailsProps) => {
  return (
    <div className="min-h-screen bg-white font-nunito">

      {/* ── Reusable Banner (same as Campaign, About, etc.) ── */}
      <PageBanner
        bgImage={ourcausebanner}
        tagline="Together for a Better Society"
        title={sponsor.name}
        smallIcon="mdi:handshake-outline"
        titleClassName="leading-tight xl:leading-[1.1]"
      />

      {/* ── Main Content ── */}
      <section className="container mx-auto px-4 max-w-5xl py-14 md:py-20">
        <AnimatedReveal direction="up" duration={0.7}>
          <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">

            {/* Left — Logo + Meta */}
            <FadeUpCard delay={0.1} className="w-full md:w-72 flex-shrink-0">
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 flex items-center justify-center mb-5">
                <Image
                  src={sponsor.logo}
                  alt={`${sponsor.name} logo`}
                  width={200}
                  height={100}
                  className="object-contain w-auto h-24"
                />
              </div>

              {/* Meta cards */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-green/5 border border-green/20 rounded-xl px-4 py-3">
                  <Icon icon="mdi:tag-outline" className="text-dark-green text-lg flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Category</p>
                    <p className="text-sm text-foreground font-semibold">{sponsor.category}</p>
                  </div>
                </div>

                {sponsor.location && (
                  <div className="flex items-center gap-3 bg-green/5 border border-green/20 rounded-xl px-4 py-3">
                    <Icon icon="mdi:map-marker-outline" className="text-dark-green text-lg flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Location</p>
                      <p className="text-sm text-foreground font-semibold">{sponsor.location}</p>
                    </div>
                  </div>
                )}

                {sponsor.website && (
                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-dark-green text-white rounded-xl px-4 py-3 hover:bg-dark-green/90 transition-colors duration-200 group"
                  >
                    <Icon icon="mdi:web" className="text-yellow text-lg flex-shrink-0" />
                    <div>
                      <p className="text-xs text-yellow font-semibold uppercase tracking-wide">Website</p>
                      <p className="text-sm font-semibold truncate max-w-[160px]">Visit Website</p>
                    </div>
                    <Icon
                      icon="mdi:arrow-top-right"
                      className="text-yellow ml-auto group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                    />
                  </a>
                )}
              </div>
            </FadeUpCard>

            {/* Right — Content */}
            <FadeUpCard delay={0.2} className="flex-1 min-w-0">
              <p className="text-lg md:text-xl font-semibold text-dark-green leading-snug mb-6 border-l-4 border-yellow pl-4">
                {sponsor.shortDescription}
              </p>
              <div className="text-gray-600 leading-relaxed space-y-4">
                {sponsor.description.split("\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </FadeUpCard>
          </div>
        </AnimatedReveal>

        {/* ── Back Navigation ── */}
        <div className="mt-14 pt-8 border-t border-gray-100">
          <Link
            href="/sponsors"
            className="inline-flex items-center gap-2 text-dark-green font-semibold hover:gap-3 transition-all duration-200 group"
          >
            <Icon
              icon="mdi:arrow-left"
              className="text-xl group-hover:-translate-x-1 transition-transform duration-200"
            />
            Back to All Sponsors
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SponsorDetails;
