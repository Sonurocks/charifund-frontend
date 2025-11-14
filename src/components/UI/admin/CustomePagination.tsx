"use client";
import { AdminCustomPaginationProps } from "@/src/types/admin";
import React from "react";

const AdminCustomPagination: React.FC<AdminCustomPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];

    const delta = 1;

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (rangeStart > 2) {
      pages.push("...");
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePageNumbers();

  return (
    <div className="flex  items-center justify-center gap-1 mb-6 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-7 h-7 flex items-center justify-center rounded-full text-white
          transition-all duration-300 transform hover:scale-103 animate-fade-in text-sm
          ${currentPage === 1
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-lime-green hover:bg-green cursor-pointer text-white"}
        `}
      >
        «
      </button>

      {pages.map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="px-1 text-[#667471]">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(Number(page))}
            className={`w-7 h-7 flex items-center justify-center rounded-full  
              transition-all duration-300 transform hover:scale-103 animate-slide-up text-xs
              ${page === currentPage
                ? "bg-yellow text-foreground font-bold shadow-lg"
                : "bg-white text-foreground hover:bg-green hover:text-white cursor-pointer"}
            `}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-7 h-7 flex items-center justify-center rounded-full text-white
          transition-all duration-300 transform hover:scale-103 animate-fade-in text-sm
          ${currentPage === totalPages
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-lime-green hover:bg-green cursor-pointer"}
        `}
      >
        »
      </button>
    </div>
  );
};

export default AdminCustomPagination;
