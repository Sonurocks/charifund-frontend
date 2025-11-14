"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";

import { useRouter } from "next/navigation";
import Notice from "../../../UI/web/Notice";
import DonationInput from "../../DonateUs/DonationInput";
import RadioGroup from "../../../UI/web/RadioGroup";
import Button from "../../../UI/web/Buttons/Button";
import { Donationmethods } from "@/src/staticResource";
import { community2, yellowspade } from "@/public/assets";
import { motion } from 'framer-motion'
import SideImage from "./SideImage";
import AnimatedReveal from "@/src/animations/AnimatedReveal";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store";
import { setAmount, setMethod } from "@/src/store/slice/donationSlice";
import { pageBannerBackgourndColor } from "@/src/helper/PageBanner";

const Community = ({hasfeedback}:{hasfeedback?:boolean|null}) => {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
  const { amount, method } = useSelector((state: RootState) => state.donation);
    const presetAmounts = [20, 50, 100, 200];
    const router = useRouter();

    const handleDonateNow = () => {
        router.push('/donate-us');
    };

    return (
        <section
            className={`relative ${hasfeedback?'h-[800px]':'h-[990px]'}  z-40 text-white flex justify-center items-cente overflow-hidde`}
        >
            <div className="absolute  z-0 inset-0">
                <Image src={community2.src} alt="bg image" fill className="object-cover" />
            </div>

            <motion.div
                animate={{
                    scale: [1.5, 2.5, 1.5],
                    opacity: [0.6, 1, 0.6],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="hidden md:block absolute top-[37%] xl:top-[32%] right-20 xl:right-58 transform -translate-y-1/2 text-palate-yellow  z-2"
            >
                <Image src={yellowspade.src} alt="decoration" className="size-20 xl:size-40" fill/>
            </motion.div>

            <div className="inset-0 z-1 absolute"
                style={pageBannerBackgourndColor}>

            </div>

            <section className="z-3 py-20 w-11/12 xl:w-10/12 font-nunito  shadow-5xl">

                <motion.div
                    initial={{ opacity: 0, transform: "translateZ(0)" }}
                    whileInView={{ opacity: 1, transform: "translateZ(0)" }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                >

                    <p className={`text-yellow font-medium flex items-center gap-2 font-caveat ${i18n.language === 'hindi' ? 'text-sm' : 'text-base'}`} style={{fontSize: i18n.language === 'hindi' ? 'clamp(0.875rem, 2.5vw, 1.5rem)' : 'clamp(1rem, 2.5vw, 1.5rem)'}}>
                        <Icon icon="mdi:hand-heart" className=" cursor-pointer" />
                        {t("Start Donating Poor People")}
                    </p>

                    <h1 className={`font-extrabold text-white leading-tight mt-5 font-nunito max-w-xl lg:max-w-2xl ${i18n.language === 'hindi' ? 'text-base' : 'text-lg'}`} style={{fontSize: i18n.language === 'hindi' ? 'clamp(1rem, 4vw, 2.5rem)' : 'clamp(1.125rem, 4vw, 3rem)'}}>
                        {t("Join The")} <span className="text-yellow">{t("community")}</span>  {t("To Give Education For Children")}
                    </h1>

                </motion.div>
                <AnimatedReveal
                 className="max-w-7xl h-[650px] bg-white   rounded-2xl overflow-hidden mx-auto grid lg:grid-cols-8 xl:grid-cols-5 relative bottom-[-50px] z-5 mb-15">

                    <div className="bg-white text-foreground rounded-xl  py-4 px-4 md:p-12 w-full lg:col-span-5 xl:col-span-3  relative z-10">
                        <h2 className="md:text-3xl font-bold mb-3  md:mb-10">{t("Support Where It Counts")}.</h2>

                        <div className="mb-8">
                            <Notice message={t("Test Mode Is Enabled. While In Test Mode No Live Donations Are Processed.")} />
                        </div>

                        {/* Donation Input */}
                        <DonationInput
                            presetAmounts={presetAmounts}
                            value={amount}
                            onAmountChange={(val) => dispatch(setAmount(val))}
                        />

                        {/* Payment Methods */}
                        <div className="space-y-3 mt-10">
                            <p className="text-xl font-semibold">{t("Select Payment Method")}</p>
                            <RadioGroup
                                name="payment"
                               // options={Donationmethods}
                               options={Donationmethods.map(option => ({
                                ...option,
                                label: t(option.label) // Translate each option label
                               }))}
                                value={method}
                                onChange={(val)=>dispatch(setMethod(val))}
                                selectedColor="bg-green"
                                unselectedColor="bg-gray-300"
                                className="mb-6"
                            />
                        </div>
                        <div className="w-fit">

                            <Button text={t("Donate Now")} onClick={handleDonateNow} />
                        </div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, transform: "translateZ(0)" }}
                        whileInView={{ opacity: 1, transform: "translateZ(0)" }}
                        transition={{ duration: 1, delay: 0.2 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="lg:col-span-3 xl:col-span-2"
                    >
                        <SideImage />
                    </motion.div>

                </AnimatedReveal>
            </section>

        </section>
    );
};

export default Community;
