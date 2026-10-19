"use client";

import React from "react";
import Breadcrumb from "../Breadcrumb";
import CategoryTable from "./CategoryTable";

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
