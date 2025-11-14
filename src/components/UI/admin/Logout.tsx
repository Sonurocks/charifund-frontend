"use client";

import React, { forwardRef, useState } from "react";
import { motion } from "framer-motion";
import { FaSignOutAlt } from "react-icons/fa";
import Cookies from "js-cookie";
import api from "@/src/services/admin/api";



const Logout = forwardRef<HTMLButtonElement, {onLogout?: () => void}>(({ onLogout },logoutRef) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      
      // Get token from cookies
      const token = Cookies.get("token");
      
      if (token) {
        // Call logout API
        await api.post("/api/V1/user/logout");
      }
      
      // Clear authentication data
      if (typeof window !== "undefined") {
        Cookies.remove("token");
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        sessionStorage.clear();
      }
      
      // Call custom logout handler if provided
      if (onLogout) {
        onLogout();
      } else {
        // Default behavior - redirect to home page
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, clear local data and redirect
      if (typeof window !== "undefined") {
        Cookies.remove("token");
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        sessionStorage.clear();
      }
      
      if (onLogout) {
        onLogout();
      } else {
        window.location.href = "/login";
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleLogout}
      ref={logoutRef}
      disabled={isLoading}
      whileHover={{ scale: isLoading ? 1 : 1.05 }}
      whileTap={{ scale: isLoading ? 1 : 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition-colors duration-200 ${
        isLoading 
          ? "bg-gray-400 cursor-not-allowed" 
          : "bg-red-500 hover:bg-red-600 cursor-pointer"
      } text-white`}
    >
      <FaSignOutAlt className="w-4 h-4" />
      <span className="font-medium">
        {isLoading ? "Logging out..." : "Logout"}
      </span>
    </motion.button>
  );
});

export default Logout;
