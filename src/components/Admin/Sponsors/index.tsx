"use client";

import React from "react";
import Breadcrumb from "../Breadcrumb";
import SponsorTable from "./SponsorTable";

const SponsorsAdmin = () => {
  return (
    <div>
      <Breadcrumb lable="Sponsors" />
      <section className="mt-5">
        <SponsorTable />
      </section>
    </div>
  );
};

export default SponsorsAdmin;
