import ServiceDetail from "@/src/components/Web/Services/ServiceDetail";
import { servicesData } from "@/src/static-resource/services";
import { Metadata } from "next";
import { notFound } from "next/navigation";
export function generateStaticParams() {
  return servicesData.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);
  if (!service) {
    return { title: "Service Not Found | YUWA INDIA" };
  }
  return {
    title: `${service.defaultTitle} | YUWA INDIA`,
    description: service.defaultDesc,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);
  
  if (!service) {
    notFound();
  }

  const relatedServices = servicesData
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3);
  
  return <ServiceDetail service={service} relatedServices={relatedServices} />;
}
