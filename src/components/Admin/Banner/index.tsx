
'use client';

import React from "react";
import dynamic from "next/dynamic";

const Breadcrumb = dynamic(() => import("../Breadcrumb"), {
  loading: () => <p>Loading breadcrumb...</p>,
});

const BannerTable = dynamic(() => import("./BannerTable"), {
  loading: () => <p>Loading banner table...</p>,
});

const Banner = () => {
  return (
    <div>
      <Breadcrumb lable="Banner" />
      <BannerTable />
    </div>
  );
};

export default Banner;
