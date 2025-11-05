import Blogdetail from '@/src/components/Web/Blog/Blogdetail';
import { generateOpenGraphMetadata } from '@/src/helper/GenerateMetaTags';
import { fetchBlogByIdServerSide } from '@/src/services/web/server/serverServices';
import { MetadataData } from '@/src/types';

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const data = await fetchBlogByIdServerSide(id);

    const metadata: MetadataData = {
      id: data.id,
      title: data.title,
      description: data.description,
      summary: data.summary,
      images: data.images,
      path: '/blog',
    };

    return generateOpenGraphMetadata(metadata, "Charifund");

  } catch (error: any) {
    console.error("❌ Error fetching blog metadata:", error.message);
    return {
      title: 'Blog not found',
      description: 'This blog could not be loaded.',
    };
  }
}

export default function BlogPage() {
  return <Blogdetail />;
}
