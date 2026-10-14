'use client';
import React from 'react';
import './loader.css';

const CustomLoader = () => {
  return (
    <div className="h-full w-full flex justify-center items-center py-6">
      <span className="loader"></span>
    </div>
  );
};

export default CustomLoader;
