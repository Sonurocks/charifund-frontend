import About from "@/src/components/Web/About";
import { title } from "process";
import React from "react";

export const metadata = {
  title:"charifund | About us"
}

const Page = () => {
  return (
    <div>
      <About />
    </div>
  );
};

export default Page
