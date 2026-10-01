"use client";
import RadioGroup from "../../UI/web/RadioGroup";
import Button from "../../UI/web/Buttons/Button";
import DetailsForm from "./DetailsForm";
import { Donationmethods } from "@/src/static-resource/web";
import Notice from "../../UI/web/Notice";
import DonationInput from "./DonationInput";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store";
import { setAmount, setMethod } from "@/src/store/slice/donationSlice";
import { useTranslation } from "react-i18next";

const Donation = ({ campaignId }: { campaignId?: string }) => {
  const dispatch=useDispatch();
  const { amount, method } = useSelector((state: RootState) => state.donation);
  const { t } = useTranslation();
  const presetAmounts = [20, 50, 100, 200];
  return (
    <div className="max-w-2xl mx-auto xl:px-4 xl:py-8 space-y-8 ">
      <h2 className="text-xl font-semibold">{t("Support Where It Counts.")}</h2>
      {/* Notice */}
      <Notice message={t("Online Payment via Razorpay and Offline Donation are supported.")} />

      {/* Donation Input */}
      <DonationInput
        presetAmounts={presetAmounts}
        value={amount}
        onAmountChange={(val) => dispatch(setAmount(val))}
      />

      {/* Payment Methods */}
      <div className="space-y-3">
        <p className="text-xl font-semibold">{t("Select Payment Method")}</p>
        <RadioGroup
          name="payment"
          options={Donationmethods}
          value={method}
          onChange={(val)=>dispatch(setMethod(val))}
          selectedColor="bg-green"
          unselectedColor="bg-gray-300"
          className="mb-6"
        />
        {method === "online" && (
          <p className="text-sm text-gray-500 mt-2">
            {t("Razorpay supports UPI, Cards, NetBanking, and Wallets.")}
          </p>
        )}
      </div>
      <div className="bg-gray-200 h-[3px]" />
      <DetailsForm campaignId={campaignId} />
    </div>
  );
};

export default Donation;
