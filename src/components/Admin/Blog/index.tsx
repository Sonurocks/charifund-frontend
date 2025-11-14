
"use client";

import React from "react";
import dynamic from "next/dynamic";
import Breadcrumb from "../Breadcrumb";

//  Dynamically import BlogTable with a fallback loader
const BlogTable = dynamic(() => import("./BlogTable"), {
  loading: () => <p className="text-center py-10">Loading Blog Table...</p>,
  ssr: false, 
});

const BlogPage = () => {
  return (
    <div>
      <Breadcrumb lable="Blog" />
      <section className="mt-5">
        <BlogTable />
      </section>
    </div>
  );
};

export default BlogPage;
