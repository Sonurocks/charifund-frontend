import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import Modal from "../../UI/web/Modal";

interface PaymentData {
  amount: number;
  paymentId: string;
  orderId: string;
  status: string;
  date: string;
}

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetDonation: () => void;
  paymentData: PaymentData | null;
}

export default function ThankYouModal({ isOpen, onClose, onResetDonation, paymentData }: ThankYouModalProps) {
  const { t } = useTranslation();

  if (!paymentData) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md lg:max-w-2xl"
      showCloseButton={true}
      className="rounded-3xl"
    >
      <div className="flex flex-col items-center text-center space-y-2 lg:space-y-4 pb-2 lg:pb-4">
        <div className="flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-green/10 rounded-full lg:mt-2">
          <CheckCircle2 className="w-7 h-7 lg:w-10 lg:h-10 text-green" />
        </div>

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-green font-nunito">
          {t("Thank You for Your Donation!")}
        </h2>
        
        <p className="text-gray-600 text-sm lg:text-base leading-snug lg:leading-relaxed px-2 lg:px-12">
          {t("Your contribution helps us continue our work and create a positive impact in the community.")}
        </p>

        <div className="w-full bg-light-gray/30 border border-gray-light rounded-xl lg:rounded-2xl p-3 lg:p-5 mt-2 lg:mt-6 space-y-1 lg:space-y-3 text-left">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200/60">
            <span className="text-gray-500 text-sm font-medium">{t("Payment Status")}</span>
            <span className="text-green font-bold text-sm bg-green/10 px-3 py-1 rounded-full">{t(paymentData.status)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">{t("Donation Amount")}</span>
            <span className="text-dark-green font-bold font-nunito text-base">₹{paymentData.amount}</span>
          </div>
          <div className="flex justify-between items-center text-sm gap-2">
            <span className="text-gray-500 font-medium shrink-0">{t("Transaction ID")}</span>
            <span className="text-dark-green font-semibold font-mono text-[10px] sm:text-xs truncate text-right">
              {paymentData.paymentId}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm gap-2">
            <span className="text-gray-500 font-medium">{t("Date")}</span>
            <span className="text-gray-900 font-medium">{paymentData.date}</span>
          </div>
        </div>

        <div className="flex justify-center w-full mt-4 lg:mt-6">
          <button 
            type="button"
            onClick={() => window.location.href = '/'}
            className="w-full sm:w-2/3 cursor-pointer py-3.5 px-6 bg-green hover:bg-dark-green text-white font-semibold rounded-xl transition-colors duration-200"
          >
            {t("Back to Home")}
          </button>
        </div>
      </div>
    </Modal>
  );
}
