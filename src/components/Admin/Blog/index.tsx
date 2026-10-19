"use client";

import React from "react";
import Breadcrumb from "../Breadcrumb";
import BlogTable from "./BlogTable";

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
