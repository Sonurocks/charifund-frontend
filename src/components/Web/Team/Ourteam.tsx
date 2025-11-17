"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import CustomLoader from "../../UI/web/Loader/CustomLoader";
import { VolunteerCard } from "./TeamMemberCard";
import { TeamMember } from "@/src/types/web/members";
import { useFetchAllMembers } from "@/src/hooks/web/useMembers";
import WebCustomPagination from "../../UI/web/Pagination/Paginationlogic";

const Ourteams = () => {
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();

  const { data: memberData, isLoading } = useFetchAllMembers(currentPage, itemsPerPage);

  // 🔐 SAFE NORMALIZATION
  const safeMemberData = memberData ?? { members: [], totalPages: 1 };

  const members: TeamMember[] = Array.isArray(safeMemberData.members)
    ? safeMemberData.members
    : [];

  const totalPages: number =
    typeof safeMemberData.totalPages === "number" && safeMemberData.totalPages > 0
      ? safeMemberData.totalPages
      : 1;

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <CustomLoader />
      </div>
    );
  }

  return (
    <section className="relative bg-cover py-16 bg-center w-full bg-[url('/assets/bg-one-volunteer.webp')] ">
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">

        <div className="flex items-center text-green justify-center gap-3 mb-2">
          <i className="text-lg lg:text-2xl hand-icon"></i>
          <span className="font-caveat text-xl md:text-2xl lg:text-2xl font-semibold">
            {t("Start Donating Poor People")}
          </span>
        </div>

        <h2 className="text-[30px] md:text-[40px] lg:text-[42px] xl:text-[56px] font-nunito text-dark-green font-[800]">
          <span>{t("Meet Our Volunteer")}</span>{" "}
          <span className="text-yellow">{t("Team")}</span>{" "}
          <span>{t("Members")}</span>
        </h2>

        <div className="w-full px-4 py-8">
          {members.length === 0 ? (
            <p className="text-gray-700 font-semibold text-lg py-10">
              {t("No team members found.")}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {members.map((member: TeamMember, index: number) => (
                <VolunteerCard key={member.id || index} member={member} idx={index} />
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <WebCustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <div className="absolute hidden xl:block top-[10%] right-[6%] z-[-1]">
        <Image
          src="/assets/greenspade.webp"
          alt="green spade"
          width={70}
          height={70}
          className="animate-dip-dop drop-shadow-[3px_3px_6px_rgba(0,113,93,0.9)]"
        />
      </div>
    </section>
  );
};

export default Ourteams;
