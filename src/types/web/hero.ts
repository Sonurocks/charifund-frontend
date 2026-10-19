import { StaticImageData } from "next/image";

export interface PageBannerProps {
  bgImage?: StaticImageData | string; 
  overlayColor?: string; 
  smallIcon?: string; 
  tagline?: string; 
  title?: string; 
  titleClassName?: string;
  decoIcon?: string; 
  decoPosition?: string; 
  description?: string;
  buttonText?: string;
  buttonRoute?: string;
}

export interface PulsingImageProps {
  src: StaticImageData | string;
  alt?: string;
  height?: number | string; 
  width?: number | string;
  className?: string; 
  duration?: number; 
  scaleRange?: [number, number]; 
  opacityRange?: [number, number]; 
}