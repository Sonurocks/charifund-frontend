"use client";
import RadioGroup from "../../UI/web/RadioGroup";
import Button from "../../UI/web/Buttons/Button";
import DetailsForm from "./DetailsForm";
import { Donationmethods } from "@/src/static-resource/web";
import DonationInput from "./DonationInput";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store";
import { setAmount, setMethod } from "@/src/store/slice/donationSlice";
import { useTranslation } from "react-i18next";

const Donation = ({ campaignId }: { campaignId?: string }) => {
  const dispatch=useDispatch();
  const { amount, method } = useSelector((state: RootState) => state.donation);
  const { t } = useTranslation();
  const presetAmounts = [50, 100, 200, 500];
  return (
    <div className="max-w-2xl mx-auto xl:px-4 xl:py-8 space-y-8 ">
      <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">{t("Support Where It Matters")}</h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            {t("Your support helps us make a meaningful difference in the lives of children, women and communities. Every contribution helps us continue our work in education, healthcare, skill development, blood donation and community welfare.")}
          </p>
      </div>

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
      </div>
      <div className="bg-gray-200 h-[3px]" />
      <DetailsForm campaignId={campaignId} />
    </div>
  );
};

export default Donation;
