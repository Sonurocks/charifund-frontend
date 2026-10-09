import React from "react";
import Services from "@/src/components/Web/Services";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | YUWA INDIA - Youth Util Welfare Association",
  description: "Discover YUWA INDIA's initiatives in child education, women empowerment, healthcare, blood donation, skill development, food support and environmental protection.",
};

const ServicesPage = () => {
  return <Services />;
};

export default ServicesPage;
