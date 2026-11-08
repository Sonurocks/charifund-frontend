import { logo } from "@/public/assets";
import { MetadataData } from "../types";

export function generateOpenGraphMetadata(data: MetadataData, siteName = "GiveSphere") {
  const title = data.title.replace(/["',]$/g, '');
  const fullTitle = `${siteName} | ${title}`; 
  const description = data.description || data.summary || '';
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "";
  const url = `${frontendUrl}${data.path ? `${data.path}/` : "/"}${data.id ? encodeURIComponent(data.id) : ""}`;
  const defaultImage = frontendUrl ? `${frontendUrl}${logo.src}` : logo.src;

  return {
    title: fullTitle, 
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      type: 'article',
      images: [
        {
          url: data.images?.[0] || defaultImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [data.images?.[0] || defaultImage],
    },
  };
}
