'use client';

import { PanelButtonProps } from "@/src/types";

const PanelButton = ({
  text,
  bgColor = 'bg-blue-600',
  textColor = 'text-white',
  onClick,
  className = '',
}: PanelButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`${bgColor} ${textColor} px-6 py-2 rounded ${className} cursor-pointer`}
    >
      {text}
    </button>
  );
};

export default PanelButton;
