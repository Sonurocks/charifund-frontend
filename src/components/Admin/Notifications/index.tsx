"use client";
import React, { JSX } from "react";
import Breadcrumb from "../Breadcrumb";
import { motion, Variants } from "framer-motion";
import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaBell } from "react-icons/fa";
import { Notification } from "@/src/types/admin";

const Notifications = () => {
  const notifications: Notification[] = [
    { id: 1, title: "New Member Joined", description: "John Doe has joined Charifund.", type: "info", time: "2 mins ago" },
    { id: 2, title: "Campaign Funded", description: "Charity A reached its funding goal of ₹12,000.", type: "success", time: "30 mins ago" },
    { id: 3, title: "Pending Approval", description: "Campaign 'Clean Water Initiative' is pending approval.", type: "warning", time: "1 hour ago" },
    { id: 4, title: "System Alert", description: "Server downtime scheduled at 12:00 AM.", type: "alert", time: "Yesterday" },
  ];

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, type: "spring", stiffness: 80 },
    }),
  };

  const typeColors: Record<string, string> = {
    info:"bg-yellow-100 text-yellow-500",
    success:"bg-yellow-100 text-yellow-500",
    warning: "bg-yellow-100 text-yellow-500",
    alert: "bg-yellow-100 text-yellow-500",
  };

  const typeIcons: Record<string, JSX.Element> = {
    info: <FaInfoCircle size={20} />,
    success: <FaCheckCircle size={20} />,
    warning: <FaExclamationTriangle size={20} />,
    alert: <FaBell size={20} />,
  };

  return (
    <div className=" w-full">
      <Breadcrumb lable="Notifications" />

      <div className="mt-6 bg-white rounded-xl py-4">
        {notifications.map((notif, index) => (
          <motion.div
            key={notif.id}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02, backgroundColor: "rgba(243, 244, 246, 0.6)" }}
            className="flex  items-start gap-4 p-4 mb-3 rounded-lg cursor-pointer"
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${typeColors[notif.type]}`}>
              {typeIcons[notif.type]}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">{notif.title}</h4>
              <p className="text-gray-600 text-sm mt-1">{notif.description}</p>
              <span className="text-gray-400 text-xs mt-1 block">{notif.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
