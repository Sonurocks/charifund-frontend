
import Blogdetail from '@/src/components/Web/Blog/Blogdetail';

// Metadata for SEO & social sharing
export async function generateMetadata({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${params.id}`);
  if (!res.ok) return { title: 'Blog not found' };
  const data = await res.json();

  return {
    title: data.title,
    description: data.summary || data.description,
    openGraph: {
      title: data.title,
      description: data.summary || data.description,
      url: `https://yourdomain.com/blog/${params.id}`,
      type: 'article',
      images: [
        {
          url: data.images?.[0] || 'https://yourdomain.com/default-image.jpg',
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
    },
  };
}

export default function BlogPage({ params }: { params: { id: string } }) {
  return <Blogdetail />;
}
