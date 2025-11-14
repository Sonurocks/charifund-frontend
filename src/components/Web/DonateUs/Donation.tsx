"use client";
import RadioGroup from "../../UI/web/RadioGroup";
import Button from "../../UI/web/Buttons/Button";
import DetailsForm from "./DetailsForm";
import { Donationmethods } from "@/src/staticResource";
import Notice from "../../UI/web/Notice";
import DonationInput from "./DonationInput";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store";
import { setAmount, setMethod } from "@/src/store/slice/donationSlice";
import { useTranslation } from "react-i18next";

const Donation = () => {
  const dispatch=useDispatch();
  const { amount, method } = useSelector((state: RootState) => state.donation);
  const { t } = useTranslation();

  const presetAmounts = [20, 50, 100, 200];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) dispatch(setAmount(val));
  };

  return (
    <div className="max-w-2xl mx-auto xl:px-4 xl:py-8 space-y-8 ">
      <h2 className="text-xl font-semibold">{t("Support Where It Counts.")}</h2>
      {/* Notice */}
      <Notice message={t("Test Mode Is Enabled. While In Test Mode No Live Donations Are Processed.")} />

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
      <div className="container w-[200px]">
        <Button text={t("Donate Now")} />
      </div>
      <div className="bg-gray-200 h-[3px]" />
      <DetailsForm />
    </div>
  );
};

export default Donation;
