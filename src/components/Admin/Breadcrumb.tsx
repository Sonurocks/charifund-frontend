"use client";

import React from "react";
import { motion } from "framer-motion";
import Logout from "../UI/admin/Logout";
import { useTranslation } from "react-i18next";


const Breadcrumb = ({ lable }:{lable:string}) => {
  const{t}=useTranslation();
  return (
    <div className="flex justify-between items-center mb-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="text-gray-600 font-semibold text-2xl cursor-pointer"
      >
        {t(lable)}
      </motion.div>
      {/* <Logout /> */}
    </div>
  );
};

export default Breadcrumb;
