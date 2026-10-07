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
import toast from "react-hot-toast";

interface DonationProps {
  campaignId?: string;
  campaignTitle?: string;
}

const Donation: React.FC<DonationProps> = ({ campaignId, campaignTitle }) => {
  const dispatch=useDispatch();
  const { amount, method } = useSelector((state: RootState) => state.donation);
  const { t } = useTranslation();
  const presetAmounts = [20, 50, 100, 200];

  const handlePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    if (!campaignId) {
      toast.error("Please select a valid campaign to donate to.");
      return;
    }

    try {
      // 1. Create order on backend
      const res = await fetch("http://localhost:8081/api/V1/web/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount), campaignId, campaignTitle }),
      });
      const orderData = await res.json();

      if (!orderData || !orderData.orderId) {
        toast.error("Failed to create order");
        return;
      }

      // 2. Initialize Razorpay
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Cherifunds",
        description: `Donation for ${campaignTitle}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // 3. Verify Payment on backend
          const verifyRes = await fetch("http://localhost:8081/api/V1/web/payment/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          toast.success(verifyData.msg);
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const _window = window as any;
      if (_window.Razorpay) {
        const rzp = new _window.Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          toast.error("Payment Failed: " + response.error.description);
        });
        rzp.open();
      } else {
        toast.error("Razorpay SDK not loaded");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-2xl mx-auto xl:px-4 xl:py-8 space-y-8 ">
      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
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
        <Button text={t("Donate Now")} onClick={handlePayment} type="button" />
      </div>
      <div className="bg-gray-200 h-[3px]" />
      <DetailsForm />
    </div>
  );
};

export default Donation;
