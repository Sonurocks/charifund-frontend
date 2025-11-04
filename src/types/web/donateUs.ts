export interface Cause {
  id: number;
  title: string;
  date: string;
  images: string[];
  createdAt?:string;
}

export interface DonationCardProps {
  icon?: string; 
  subtitle: string;
  title: string;
  buttonText: string;
  onButtonClick?: () => void;
  backgroundImage: string;
   onCardClick: (id: string) => void;
}

export interface TagListProps {
  tags: string[];
  onClick?: (tag: string) => void;
  bgColor?:string;
}