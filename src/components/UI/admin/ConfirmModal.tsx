import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { ConfirmModalProps } from "@/src/types/admin";
import ButtonLoader from "../web/Loader/ButtonLoader";

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  onConfirm,
  onCancel,
  loading,
  buttonText = "Confirm",
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center relative">
              {/* Top-right close icon */}
              <button
                type="button"
                onClick={onCancel}
                className="absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-600 transition p-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
                aria-label="Close"
              >
                <IoClose className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-bold text-gray-800">{title}</h2>
              <p className="text-gray-500 mt-2 text-sm leading-relaxed">{message}</p>

              <div className="flex justify-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-5 cursor-pointer py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition text-sm font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={loading}
                  className="px-5 cursor-pointer py-2 rounded-xl bg-yellow-500 text-white hover:bg-yellow-600 transition text-sm font-medium shadow-xs disabled:opacity-50"
                >
                  {loading ? <ButtonLoader /> : buttonText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
