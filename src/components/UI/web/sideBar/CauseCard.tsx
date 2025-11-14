"use client";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { Cause } from "@/src/types/web/donateUs";
import { FaCalendarAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";


const CauseCard = ({ cause,route }: { cause: Cause,route?:string }) => {
const router=useRouter();
  const formattedDate = cause?.createdAt
    ? new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(cause.createdAt))
    : "";
  return(
  <motion.div
    transition={{ duration: 0.3 }}
    onClick={()=>router.push(`/${route}/${cause.id}`)}
    className="grid grid-cols-8 xs:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-4  cursor-pointer items-center gap-7 xs:gap-4 md:gap-4 xl:gap-5 mb-4"
  >
    <div className="md:w-20 w-17 h-17 xs:w-full md:h-20 2xl:w-full col-span-2 xs:col-span-1 md:col-span-1 relative flex items-center  justify-center rounded-full md:rounded-lg overflow-hidden">
      <Image src={cause?.images?.[0]||''} alt={cause.title} fill className="object-cover w-full h-full" />
    </div>
    <div className="col-span-6 xs:col-span-4 md:col-span-6  ml-3 lg:col-span-8 xl:col-span-3">
      <div className="flex items-center  text-gray-500 text-xs xs:text-[12px] md:text-sm gap-1">
        <FaCalendarAlt   className="mr-2" />
        <span>{formattedDate}</span>
      </div>
      <h4 className="font-semibold font-nunito text-[12px] xs:text-[14px] md:text-[19px] pt-1 text-dark-green hover:text-green">
        {cause.title}
      </h4>
    </div>
  </motion.div>
);
};

export default CauseCard;
