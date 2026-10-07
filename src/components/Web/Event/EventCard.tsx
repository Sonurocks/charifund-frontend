"use client";
import React from "react";
import CampaignCard from "../Campaign/CampaignCard";
import { useTranslation } from "react-i18next";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    location: string;
    date: string;
    image: string;
  };
  large?: boolean; // Kept for backward compatibility
  index?: number; 
}

export default function EventCard({ event }: EventCardProps) {
  const { t } = useTranslation();
  const [hoveredCard, setHoveredCard] = React.useState<string | null>(null);
  
  // Transform Event data into CampaignCard expected footprint
  const mappedCardData = {
    id: event.id,
    image: event.image,
    category: event.date,
    title: event.title,
    description: event.location?.length > 75 
        ? event.location.slice(0, 75) + "..." 
        : event.location,
    progress: 0,
    raised: "0",
    goal: "0",
    actionText: t("View Details →"),
    actionRoute: `/events/${event.id}`
  };

  return (
    <div 
      className="w-full h-full"
      onMouseEnter={() => setHoveredCard(event.id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <CampaignCard 
        card={mappedCardData} 
        isInView={true} 
        hoveredCard={hoveredCard}
        onMouseEnter={() => setHoveredCard(event.id)}
        onMouseLeave={() => setHoveredCard(null)}
        onCardClick={() => {}}
      />
    </div>
  );
}
