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
    <div className="flex items-center justify-end gap-1.5 my-1 flex-wrap w-full">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`min-w-7 w-7 h-7 flex items-center justify-center rounded-full text-white shrink-0
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
          <span key={`ellipsis-${index}`} className="px-1 text-xs text-[#667471] select-none shrink-0">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(Number(page))}
            className={`min-w-7 h-7 px-2 flex items-center justify-center rounded-full whitespace-nowrap shrink-0
              transition-all duration-300 transform hover:scale-103 animate-slide-up text-xs font-semibold
              ${page === currentPage
                ? "bg-yellow text-foreground font-bold shadow-md"
                : "bg-white text-foreground hover:bg-green hover:text-white cursor-pointer border border-gray-200/80"}
            `}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`min-w-7 w-7 h-7 flex items-center justify-center rounded-full text-white shrink-0
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
