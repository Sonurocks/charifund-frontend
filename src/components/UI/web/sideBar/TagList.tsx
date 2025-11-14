"use client";
import FadeInUp from "@/src/animations/FadeInUp";
import { TagListProps } from "@/src/types/web/donateUs";
import React from "react";

const TagList: React.FC<TagListProps> = ({ tags, onClick,bgColor }) => {
  return (
    <FadeInUp
      className={`${bgColor} shadow-md rounded-lg p-6`}>
      <h3 className="text-xl font-semibold mb-3">Tags</h3>
      <div className="flex flex-wrap gap-5">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onClick?.(tag)}
            className="bg-gray-100 cursor-pointer px-5 py-2  text-md font-medium text-foreground hover:bg-yellow transition"
          >
            {tag}
          </button>
        ))}
      </div>
    </FadeInUp>
  );
};

export default TagList;
