

"use client";

import React from "react";
import dynamic from "next/dynamic";

//  Lazy load heavy components
const Breadcrumb = dynamic(() => import("../Breadcrumb"), {
  ssr: false,
  loading: () => <p className="text-sm text-gray-500">Loading breadcrumb...</p>,
});

const CategoryTable = dynamic(() => import("./CategoryTable"), {
  ssr: false,
  loading: () => <p className="text-sm text-gray-500">Loading categories...</p>,
});

const Category = () => {
  return (
    <div>
      <Breadcrumb lable="Category" />
      <section className="mt-5">
        <CategoryTable />
      </section>
    </div>
  );
};

export default Category;
