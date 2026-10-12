import { notFound } from "next/navigation";
import { getSponsorBySlug, getAllSponsors } from "@/src/data/sponsors";
import SponsorDetails from "@/src/components/Web/Sponsors/SponsorDetails";
import { Metadata } from "next";
import { Sponsor } from "@/src/types/web/sponsor";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getSponsor(slug: string): Promise<Sponsor | null> {
  // First check static baseline
  const staticSponsor = getSponsorBySlug(slug);
  if (staticSponsor) return staticSponsor;

  // Try API lookup for newly created sponsors
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      const res = await fetch(`${apiUrl}/web/sponsor/getSponsorBySlug/${encodeURIComponent(slug)}`, {
        next: { revalidate: 60 },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && (data.name || data.sponsor?.name)) {
          return data.sponsor || data;
        }
      }
    }
  } catch (e) {
    // Graceful fallback
  }

  return null;
}

// ── Dynamic params allowed for newly created sponsors ──────────────
export const dynamicParams = true;

// ── Static params for build-time generation ────────────────────────────────
export async function generateStaticParams() {
  const sponsors = getAllSponsors();
  return sponsors.map((s) => ({ slug: s.slug }));
}

// ── Per-page SEO metadata ──────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sponsor = await getSponsor(slug);

  if (!sponsor) {
    return { title: "Sponsor Not Found | YUWA India" };
  }

  const name = typeof sponsor.name === "string" ? sponsor.name : sponsor.name.en || "";
  const desc =
    typeof sponsor.shortDescription === "string"
      ? sponsor.shortDescription
      : sponsor.shortDescription?.en || "";

  return {
    title: `${name} | YUWA India Sponsors`,
    description: desc,
  };
}

// ── Page component ─────────────────────────────────────────────────────────
const SponsorPage = async ({ params }: Props) => {
  const { slug } = await params;
  const sponsor = await getSponsor(slug);

  if (!sponsor) {
    notFound();
  }

  return <SponsorDetails sponsor={sponsor} />;
};

export default SponsorPage;
