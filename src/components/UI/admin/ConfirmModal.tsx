import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmModalProps } from "@/src/types/admin";
import ButtonLoader from "../web/Loader/ButtonLoader";


const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  onConfirm,
  onCancel,
  loading,
  buttonText= "Confirm"
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
              <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
              <p className="text-gray-500 mt-2">{message}</p>

              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={onCancel}
                  className="px-4 cursor-pointer py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 cursor-pointer py-2 rounded-xl bg-yellow-500 text-white hover:bg-yellow-700 transition"
                >
                  {loading?<><ButtonLoader/></>:<>{buttonText}</>}
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
