"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useInView } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useFetchAllMembers } from "@/src/hooks/web/useMembers";
import Button from "../../UI/web/Buttons/Button";
import { VolunteerCard } from "../Team/TeamMemberCard";
import CustomLoader from "../../UI/web/Loader/CustomLoader";
import { bgOneVolunteer, greenspade } from "@/public/assets";
import ComponentLabel from "../../UI/web/ComponentLabel";
import ComponentTitle from "../../UI/web/ComponentTitle";

const VolunteerTeam = ({ bg = "" }: { bg?: string }) => {
  const router = useRouter();

  const [bgColor, setBgColor] = useState<string>();
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });
  const { t } = useTranslation();

  const itemsPerPage = 4;

  const { data, isLoading, isError } = useFetchAllMembers(1, itemsPerPage);

  const finalMembers = Array.isArray(data?.members) ? data.members : [];

  useEffect(() => {
    if (bg && bg.trim() !== "") {
      setBgColor(bg);
    } else {
      setBgColor(`bg-[url('/assets/bg-one-volunteer.webp')]`);
    }
  }, [bg]);

  const handleViewAll = () => {
    router.push("/team");
  };
  if (!isLoading && !isError && finalMembers.length === 0) {
    return <></>;
  }


  return (
    <section
      className={`relative bg-cover pt-6 pb-2 lg:py-30 xl:py-20 bg-center ${bgColor} w-full px-3 lg:px-0 flex justify-center items-center`}
      style={{ backgroundImage: `url(${bgOneVolunteer.src})` }}
    >
      <div
        ref={headerRef}
        className="w-full md:w-10/11 flex flex-col justify-center items-center"
      >
        {/* Title Section */}
        <div className="lg:max-w-[700px] flex flex-col items-center">
          <ComponentLabel
            className="text-center"
            text={t("Meet Our Volunteer Team")}
            isVisible={isHeaderInView}
          />

          <ComponentTitle
            className="lg:text-center"
            preText={t("Meet Our Volunteer")}
            highlightText={t("Team")}
            postText={t(" Members")}
          />
          <p className="text-center text-sm md:text-base text-gray-600 mt-4 max-w-2xl px-4">
            {t("Leading Youth Util Welfare Association with a commitment to social service, youth empowerment and community development.")}
          </p>
        </div>

        {/* Members Section */}
        <div className="w-full py-8">
          {isLoading && (
            <div className="flex justify-center py-10">
              <CustomLoader />
            </div>
          )}

          {isError && (
            <p className="text-red-500 text-center font-medium">
              Failed to load members
            </p>
          )}

          {!isLoading && !isError && finalMembers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-5 xl:gap-7">
              {finalMembers.map((member: any, idx: number) => (
                <VolunteerCard
                  key={member?.id || idx}
                  member={member}
                  idx={idx}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Button */}
        {!isLoading && !isError && finalMembers.length > 0 && (
          <div className="flex items-center w-[170px] h-[90px] justify-center mt-6">
            <Button
              text="View All"
              bgColor="bg-[#FFC107]"
              textColor="text-black"
              hoverTextColor="group-hover:text-white"
              hoverBg="before:bg-[#046b59]"
              onClick={handleViewAll}
            />
          </div>
        )}
      </div>

      {/* Side Image */}
      <div className="absolute top-[10%] md:top-[220] lg:top-[130] lg:right-[50] md:right-[-45] xl:right-[6%] z-0 font-bold hidden md:block">
        <Image
          src={greenspade}
          alt="green spade"
          className="animate-dip-dop w-10 h-10 lg:h-16 lg:w-16 drop-shadow-[3px_3px_6px_rgba(0,113,93,0.9)]"
        />
      </div>
    </section>
  );
};

export default VolunteerTeam;
