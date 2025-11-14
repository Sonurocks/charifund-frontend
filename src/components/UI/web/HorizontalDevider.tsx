"use client";

import { DividerProps } from "@/src/types";
import React from "react";



const Divider: React.FC<DividerProps> = ({
  color = "bg-yellow-400",
  height = "h-[2px]",
  gap = "gap-2",
  center = false,
  width = "w-full",
}) => {
  return (
    <div className={`flex items-center ${gap} ${width} ${center ? "justify-center" : ""}`}>
      <span className={`${height} ${color}`} style={{ width: "60%" }}></span>
      <span className={`${height} ${color}`} style={{ width: "20%" }}></span>
      <span className={`${height} ${color}`} style={{ width: "20%" }}></span>
    </div>
  );
};

export default Divider;
