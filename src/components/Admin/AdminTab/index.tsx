
"use client";
import React, { JSX, useState } from "react";
import dynamic from "next/dynamic";

//  Lazy load all heavy components
const AdminSideBarTab = dynamic(() => import("./AdminSidebarTab"), { ssr: false });
const Dashboard = dynamic(() => import("../Dashboard"), { ssr: false });
const Notifications = dynamic(() => import("../Notifications"), { ssr: false });
const Members = dynamic(() => import("../Members"), { ssr: false });
const Settings = dynamic(() => import("../Settings"), { ssr: false });
const Campaign = dynamic(() => import("../Campaign"), { ssr: false });
const Category = dynamic(() => import("../Category"), { ssr: false });
const Blog = dynamic(() => import("../Blog"), { ssr: false });
const Comments = dynamic(() => import("../comments"), { ssr: false });
const Banner = dynamic(() => import("../Banner"), { ssr: false });
const Queries = dynamic(() => import("../Queries"), { ssr: false });
const Feedback = dynamic(() => import("../Feedback"), { ssr: false });
const Event = dynamic(() => import("../event"), { ssr: false });

const AdminTab = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Define your tab map
  const Tab: { [key: string]: JSX.Element } = {
    dashboard: <Dashboard />,
    
    members: <Members />,
    settings: <Settings />,
    campaign: <Campaign />,
    event: <Event />,
    category: <Category />,
    blog: <Blog />,
    comments: <Comments />,
    banner: <Banner />,
    queries: <Queries />,
    feedback: <Feedback />,
  };

  return (
    <div className="relative md:flex gap-2 h-screen">
      <AdminSideBarTab
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="pt-12 max-h-screen overflow-y-scroll w-full px-5">
        {Tab[activeTab]}
      </div>
    </div>
  );
};

export default AdminTab;
