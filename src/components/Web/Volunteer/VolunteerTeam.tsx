"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useInView } from "framer-motion";
import Image from "next/image";
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

  const itemsPerPage = 4;

  const { data, isLoading, isError } = useFetchAllMembers(1, itemsPerPage);

  const members = Array.isArray(data?.members) ? data.members : [];

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
  if (!isLoading && !isError && members.length === 0) {
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
        <div className="lg:max-w-[600px]">
          <ComponentLabel
            className="text-center"
            text="Start Donating Poor People"
            isVisible={isHeaderInView}
          />

          <ComponentTitle
            className="lg:text-center"
            preText="Meet Our Volunteer"
            highlightText="Team"
            postText=" members"
          />
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

          {!isLoading && !isError && members.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-5 xl:gap-7">
              {members.map((member: any, idx: number) => (
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
        {!isLoading && !isError && members.length > 0 && (
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
