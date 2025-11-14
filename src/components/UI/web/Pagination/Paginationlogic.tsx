"use client";

import { WebCustomPaginationProps } from "@/src/types";
import React from "react";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";

const WebCustomPagination: React.FC<WebCustomPaginationProps> = ({
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
    <div className="flex justify-center items-center space-x-4 my-10">
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-10 h-10 flex items-center justify-center rounded-full 
          ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green cursor-pointer text-white hover:bg-yellow"
          }`}
      >
        <FaAngleDoubleLeft />
      </button>

      {/* Page Numbers */}
      {pages.map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(Number(page))}
            className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer
              ${
                page === currentPage
                  ? "bg-yellow text-foreground font-semibold"
                  : " text-foreground hover:bg-yellow hover:text-white"
              }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-10 h-10 flex items-center justify-center rounded-full 
          ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green cursor-pointer text-white hover:bg-yellow"
          }`}
      >
        <FaAngleDoubleRight />
      </button>
    </div>
  );
};

export default WebCustomPagination;
