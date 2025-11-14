import { MotionProps } from "framer-motion";
import { Dispatch, ReactNode, SetStateAction } from "react";

export interface EventInterface {
    id: string;
    title: string;
    description: string;
    summary: string;
    status: string;
    startDate: Date | null;
    startTime: Date | null;
    endDate: Date | null;
    endTime: Date | null;
    images?: string[];
    location: string;
    keyPoints: string[];
    longitude: number;
    latitude: number;
}

export interface CharityCard {
  id: number;
  title: string;
  description: string;
  icon: string;
  image: string;
  color: string;
  bgColor: string;
}

export interface DonationCardData {
  id: number;
  image: string;
  category: string;
  title: string;
  description: string;
  progress: number;
  raised: string;
  goal: string;
}

export interface SocialMediaButton {
  icon: any;
  bg: string;
  label: string;
}

export interface AnimatedRevealProps extends MotionProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  delay?: number;
  distance?: number;
  once?: boolean; 
}


export interface FadeUpCardProps {
  children: React.ReactNode;
  delay?: number; 
  className?: string;
  initialYExis?:number;  
  onAnimationComplete?: () => void;
}

export interface FadeInUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  initialYExis?:number;
}

export interface slideinFromLeftProps {
  className?: string;
  children: ReactNode;
  delay?: number;
}


export interface SlideInRightProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export interface AnimatedProgressBarProps {
  progress: number;
  isInView: boolean;
}

export interface DividerProps {
  color?: string;
  height?: string;
  gap?: string;
  center?: boolean;
  width?: string;
}

export interface InputFieldProps {
  label?: string;
  icon?: string | ReactNode;
  type?: string;
  as?: "input" | "textarea";
  placeholder?: string;
  className?:string;
  iconClassName?:string;
  placeholderClassName?:string;
  textSize?:string;
  errorTextSize?:string;
}

export interface NoticeProps {
  title?: string;
  message: string;
  icon?: React.ReactNode;
  wrapperClassName?: string;
  iconWrapperClassName?: string;
  iconClassName?: string;
  titleClassName?: string;
  messageClassName?: string;
}

export interface RadioOption {
  label: string;
  value: string;
}

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  selectedColor?: string;  
  unselectedColor?: string;  
}


export interface DynamicButtonProps {
  type?: "button" | "submit" | "reset";
  text?: string;
  icon?: string;
  hoverBg?: string;
  textColor?: string;
  hoverTextColor?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  bgColor?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  rounded?: string;
  paddingx?: string;
  paddingy?: string;
  fontWeight?: string;
}

export interface CancelButtonProps {
  text: string;
  onClose: () => void;
  icon?: string;
  rounded?:string;
  paddingX?:string;
  paddingY?:string;
  textSize?:string;
}

export interface PanelButtonProps {
  text: string;
  bgColor?: string;
  textColor?: string;
  onClick?: () => void;
  className?: string;
}

export interface LanguageSwitcherProps {
  rounded?: string;
  paddingx?: string;
  paddingy?: string;
}

export interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface WebCustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}


export interface SidebarProps{
 pathName?:string;
 as?: "Recent Cause" | "Recent Post";
 bgColor?:string;
}


export interface SearchBoxProps{
  bgColor?:string;
  searchText?:string;
  setSearchtext:Dispatch<SetStateAction<string>>;
}

export interface ContactFormValues {
    name: string;
    email: string;
    phone: string;
    message: string;
}

type IconType = React.ElementType;

export interface InfoItem {
  icon: IconType;
  title: string;
  lines?: string[];
  links?: string[];
  isSocial?: boolean;
}

export interface SocialLink {
  icon: IconType;
  href: string;
}

export interface DonationInputProps {
  presetAmounts?: number[];
  value?: string; 
  onAmountChange?: (amount: string) => void;
}

export interface DonationSectionProps{
  data?:any
  isLoading?:boolean;
  isError?:boolean;
}

export interface EventListProps {
  currentPage: number;
  onPageChange?: (page: number) => void;
}

export interface CharityCardProps {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  isTransitioning: boolean;
  animationDelay?: number;
}


export interface AnimatedCircleProps {
  percentage: number;
  label: string;
}

export interface CarouselIndicatorsProps {
  length: number;
  activeIndex: number;
  onDotClick: (index: number) => void;
}

export interface NavigationButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  color: 'yellow' | 'green';
  ariaLabel: string;
}

export interface LanguageContextType {
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;
  isLoading: boolean;
}

export interface LanguageProviderProps {
  children: ReactNode;
}