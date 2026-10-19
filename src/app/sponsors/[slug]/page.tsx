import { notFound } from "next/navigation";
import SponsorDetails from "@/src/components/Web/Sponsors/SponsorDetails";
import { Metadata } from "next";
import { Sponsor } from "@/src/types/web/sponsor";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getSponsor(slug: string): Promise<Sponsor | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://cherifund-backend-test.onrender.com/api/V1";
    const res = await fetch(`${apiUrl}/web/sponsor/getSponsorBySlug/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
        "Accept-Language": "en",
      },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.name || data.sponsor?.name)) {
        return data.sponsor || data;
      }
    }
  } catch {}

  return null;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://cherifund-backend-test.onrender.com/api/V1";
    const res = await fetch(`${apiUrl}/web/sponsor/getAllSponsors?page=1&limit=50`, {
      headers: {
        Accept: "application/json",
        "Accept-Language": "en",
      },
    });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data?.sponsors) ? data.sponsors : Array.isArray(data) ? data : [];
      return list.filter((s: any) => s && s.slug).map((s: any) => ({ slug: s.slug }));
    }
  } catch {}
  return [];
}

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

const SponsorPage = async ({ params }: Props) => {
  const { slug } = await params;
  const sponsor = await getSponsor(slug);

  if (!sponsor) {
    notFound();
  }

  return <SponsorDetails sponsor={sponsor} />;
};

export default SponsorPage;
