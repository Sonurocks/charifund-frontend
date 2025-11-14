"use client";

import CauseCard from "./CauseCard"; 

import FadeInUp from "@/src/animations/FadeInUp";
import { useTranslation } from "react-i18next";

const Recent = ({ causes,name,bgColor,route }: { causes: any,name?:string,bgColor?:string,route?:string; }) => {
  const { t } = useTranslation();
  
  if (!causes || causes.length === 0) return null;
  console.log(causes)
 return( 
  <FadeInUp
    className={`${bgColor} px-3 py-5 rounded-2xl shadow-md`}>
    <h3 className="font-extrabold text-dark-green font-nunito text-2xl mb-6">{t(name || "Recent Cause")}</h3>
    {(route==='donate-us'||route==='campaign')?(
      <>
      {(causes?.campaigns||[]).map((cause:any) => (
      <CauseCard key={cause.id} route={route} cause={cause} />
    ))}
      </>
    ):(route==='events')?(
      <>
      {(causes?.events||[]).map((cause:any)=>(
        <CauseCard key={cause.id} route={route} cause={cause} />
      ))}
      </>
    ):(
      <>
        {(causes?.blogs||[]).map((cause:any) => (
      <CauseCard key={cause.id} route={route} cause={cause} />
      ))}
      </>
    )}
  </FadeInUp>
 );
};

export default Recent;
