"use client";
import React from "react";
import Breadcrumb from "../Breadcrumb";
import { motion, Variants } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import MemberTable from "./MembersTable";


const Members = () => {
  return (
    <div className="">
      <Breadcrumb lable="Members" />
      <section className="mt-5">
        <MemberTable />
      </section>
    </div>
  );
};

export default Members;
