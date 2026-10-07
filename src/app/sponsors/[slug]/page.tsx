import { notFound } from "next/navigation";
import { getSponsorBySlug, getAllSponsors } from "@/src/data/sponsors";
import SponsorDetails from "@/src/components/Web/Sponsors/SponsorDetails";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

// ── Static params for build-time generation ────────────────────────────────
export async function generateStaticParams() {
  const sponsors = getAllSponsors();
  return sponsors.map((s) => ({ slug: s.slug }));
}

// ── Per-page SEO metadata ──────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sponsor = getSponsorBySlug(slug);

  if (!sponsor) {
    return { title: "Sponsor Not Found | YUWA India" };
  }

  return {
    title: `${sponsor.name} | YUWA India Sponsors`,
    description: sponsor.shortDescription,
  };
}

// ── Page component ─────────────────────────────────────────────────────────
const SponsorPage = async ({ params }: Props) => {
  const { slug } = await params;
  const sponsor = getSponsorBySlug(slug);

  // Unknown slug → Next.js 404 (notFound() throws internally)
  if (!sponsor) {
    notFound();
  }

  // TypeScript non-null assertion: notFound() guarantees we never reach here with null
  return <SponsorDetails sponsor={sponsor!} />;
};

export default SponsorPage;
