import FadeUpCard from '@/src/animations/FadeButtomUp'
import React, { useMemo, useRef, useState } from 'react'
import { useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import CustomLoader from '../../UI/web/Loader/CustomLoader';
import CampaignCard from './CampaignCard';
import { useFetchAllCampaigns } from '@/src/hooks/web/useCampaigns';
import ComponentLabel from '../../UI/web/ComponentLabel';
import ComponentTitle from '../../UI/web/ComponentTitle';


const CampaignGrid = () => {
    const router = useRouter();
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
    const [page, setPage] = useState(1);
    const { data, isLoading, isError }: any = useFetchAllCampaigns(page, 8);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    const campaignsToDisplay = useMemo(() => {
        if (!(data as any)?.campaigns) return [];
        return (data as any).campaigns.map((campaign: any) => ({
            id: campaign._id || campaign.id,
            image: campaign.images?.[0] || "/default-image.webp",
            category: campaign.category,
            title: campaign.title,
            description: campaign.description,
            progress: (campaign.raisedAmount / campaign.goalAmount) * 100,
            raised: `$${campaign.raisedAmount}`,
            goal: `$${campaign.goalAmount}`,
        }));
    }, [data]);

    const handleCardClick = (id?: string) => {
        if (!id) return;
        router.push(`/campaign/${id}`);
    };

    const headerRef = useRef(null);
    const isHeaderInView = useInView(headerRef, { once: true });

    return (
        <section ref={sectionRef} className="relative py-20 min-h-[500px] overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl ">
                <div ref={headerRef} className='flex justify-center items-center'>
                    <div className="lg:text-center lg:max-w-[830px] mb-5">

                        <ComponentLabel
                            text="Start Donating Poor People"
                            isVisible={isHeaderInView}
                        />
                        <ComponentTitle
                            preText="Be the reason of someone"
                            highlightText="smiles"
                            postText=""
                        />
                    </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading ? (
                        <div className="col-span-full text-center py-8">
                            <CustomLoader />
                        </div>
                    ) : isError ? (
                        <div className="col-span-full text-center py-8">
                            <p className="text-red">Failed to load campaigns. Please try again.</p>
                        </div>
                    ) : (
                        campaignsToDisplay.map((card: any, index: number) => (
                            <FadeUpCard key={card.id || index} delay={index * 0.2}>
                                <CampaignCard
                                    card={card}
                                    isInView={isInView}
                                    hoveredCard={hoveredCard}
                                    onMouseEnter={setHoveredCard}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    onCardClick={handleCardClick}
                                />
                            </FadeUpCard>
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}

export default CampaignGrid
