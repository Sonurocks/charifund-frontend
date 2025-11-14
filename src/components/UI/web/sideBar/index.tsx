'use client'
import Recent from "./Recent";
import SearchBox from "./SearchBox";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useFetchAllCampaigns } from "@/src/hooks/web/useCampaigns";
import useDebounce from "@/src/hooks/web/useDebounce";
import { useFetchAllBlogs } from "@/src/hooks/web/useBlog";
import { SidebarProps } from "@/src/types";
import { useFetchAllEvent } from "@/src/hooks/web/useEvent";

export default function Sidebar({pathName,as='Recent Cause',bgColor='bg-white'}:SidebarProps) {
    const[searchText,setSearchtext]=useState<string>('');
    const debounceValue= useDebounce(searchText,100);

    const { t } = useTranslation();

    const pathname=usePathname();
    const routeName = pathname.split("/")[1];

    let apiType;
    if (routeName === "donate-us"||routeName === "campaign") {
    apiType = "campaign";
    }else if (routeName === "blog") {
        apiType = "blogs";
    }

    const {data}=routeName==='donate-us'?useFetchAllCampaigns(1, 4,debounceValue): routeName === 'campaign'? useFetchAllCampaigns(1,4,debounceValue):routeName==='events'?useFetchAllEvent(1,4,debounceValue):useFetchAllBlogs(1, 4,debounceValue);
    
    return(
        <div className="space-y-6">
            <SearchBox bgColor={bgColor} setSearchtext={setSearchtext} searchText={searchText}/>
            <Recent bgColor={bgColor} name={as} causes={data} route={routeName} />
        </div>
    )
}