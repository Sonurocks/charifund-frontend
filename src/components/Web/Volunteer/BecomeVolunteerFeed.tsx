"use client";

import { Icon } from "@iconify/react";
import Notice from "../../UI/web/Notice";
import { VolunteerFeatures, VolunteerNotice, VolunteerPage, VolunteerProgress } from "@/src/staticResource";

const BecomeVolunteerFeed = () => {

  return (
    <section className="font-nunito">
      {/* Header */}
      <div className="mb-5 xl:mb-8 ">
        <p className="text-green font-caveat  flex items-center justify-baseline gap-2 text-2xl font-bold">
          <Icon icon="mdi:hand-heart" className="" />
          {VolunteerPage.subtitle}
        </p>
        <h2 className="font-nunito text-xl  xl:text-[50px] font-extrabold text-foreground mt-2">
          {VolunteerPage.title}
        </h2>
        <p className="mt-2 text-gray-500 text-[10px] xl:text-[15px] leading-4 xl:leading-8 ">
          {VolunteerPage.description}
        </p>
      </div>

      {/* Notice */}
      <Notice message={VolunteerNotice.message} />

      {/* Progress Bars */}
      <div className="space-y-3 xl:space-y-6 mb-6 xl:mb-10 mt-5 xl:mt-10">
        {VolunteerProgress.map((item, idx) => (
          <div key={idx}>
            {/* Label */}
            <div className="flex justify-between text-[15px] font-semibold mb-2">
              <span>{item.label}</span>
            </div>

            {/* Progress Bar */}
            <div className="relative w-full bg-gray-200 rounded-full h-[5px]">
              <div
                className="bg-green h-[5px] rounded-full relative"
                style={{ width: `${item.value}%` }}
              >
                {/* Percentage text */}
                <span className="absolute -top-6 right-0 text-[15px] font-semibold ">
                  {item.value}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-3 text-[15px] font-semibold">
        {VolunteerFeatures.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <Icon icon="prime:check-circle" className="text-green text-xl" />
            <span className="">{feature.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BecomeVolunteerFeed;