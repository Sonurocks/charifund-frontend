import { CarouselIndicatorsProps } from '@/src/types';
import React from 'react';

const CarouselIndicators: React.FC<CarouselIndicatorsProps> = ({ length, activeIndex, onDotClick }) => {
  const maxIndicators = Math.min(length, 8);
  return (
    <div className="flex justify-center mt-6 md:mt-8 space-x-1.5 md:space-x-2">
      {Array.from({ length: maxIndicators }, (_, index) => {
        const isActive = activeIndex === index;
        return (
          <button
            key={index}
            onClick={() => onDotClick(index)}
            className="w-4 h-4 md:w-5 md:h-5 rounded-full transition-all duration-300 flex items-center justify-center"
            style={{
              border: isActive ? '2px solid #046B59' : 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
            aria-label={`Go to slide ${index + 1}`}
          >
            <div
              className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${
                isActive ? 'bg-gradient-to-br from-green to-dark-green' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              style={
                isActive
                  ? { background: 'linear-gradient(135deg, #046B59 0%, #122F2A 100%)' }
                  : undefined
              }
            />
          </button>
        );
      })}
    </div>
  );
};

export default CarouselIndicators;
