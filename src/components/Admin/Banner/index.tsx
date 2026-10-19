'use client';

import React from "react";
import Breadcrumb from "../Breadcrumb";
import BannerTable from "./BannerTable";

const Banner = () => {
  return (
    <div>
      <Breadcrumb lable="Banner" />
      <BannerTable />
    </div>
  );
};

export default Banner;
