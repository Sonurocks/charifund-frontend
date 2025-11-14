import CampaignDetails from "@/src/components/Web/Campaign/CampaignDetails";
import { generateOpenGraphMetadata } from "@/src/helper/GenerateMetaTags";
import { fetchCampaignByIdServerSide } from "@/src/services/web/server/serverServices";
import { MetadataData } from "@/src/types";

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const data = await fetchCampaignByIdServerSide(id);
    const metadata: MetadataData = {
      id: data.id,
      title: data.title,
      description: data.description,
      summary: data.summary,
      images: data.images,
      path: '/campaign',
    };

    return generateOpenGraphMetadata(metadata, "Charifund");

  } catch (error: any) {
    console.error("❌ Error fetching campaign metadata:", error.message);
    return {
      title: 'Blog not found',
      description: 'This campaign could not be loaded.',
    };
  }
}

const CampaignPage = () => {
  return <CampaignDetails />
};

export default CampaignPage;







