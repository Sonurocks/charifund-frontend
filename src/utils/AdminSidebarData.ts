import { MdOutlineDashboardCustomize, MdNotificationsActive, MdCampaign, MdCategory, MdEvent } from "react-icons/md";
import { FaBloggerB, FaComments } from "react-icons/fa";
import { TbBrandGoogleBigQuery } from "react-icons/tb";
import { PiFlagBannerFill } from "react-icons/pi";
import { VscFeedback } from "react-icons/vsc";
import { IoSettings } from "react-icons/io5";
import { HiUsers } from "react-icons/hi";


export const sidebarAd = [
  {
    icon: MdOutlineDashboardCustomize,
    lable: "Dashboard",
    nav: "dashboard",
    link: "/admin/dashboard",
  },
  {
    icon: FaBloggerB,
    lable: "Blog",
    nav: "blog",
    link: "/admin/blog",
  },
  {
    icon: MdCampaign,
    lable: "Campaign",
    nav: "campaign",
    link: "/admin/campaign",
  },
  {
    icon: MdEvent,
    lable: "Event",
    nav: "event",
    link: "/admin/event",
  },
  {
    icon: TbBrandGoogleBigQuery,
    lable: "Queries",
    nav: "queries",
    link: "/admin/queries",
  },
  {
    icon: FaComments,
    lable: "Comments",
    nav: "comments",
    link: "/admin/comments",
  },
  {
    icon: MdCategory,
    lable: "Category",
    nav: "category",
    link: "/admin/category",
  },

  {
    icon: PiFlagBannerFill,
    lable: "Banner",
    nav: "banner",
    link: "/admin/banner",
  },
  {
    icon: HiUsers,
    lable: "Members",
    nav: "members",
    link: "/admin/members",
  },
  {
    icon: VscFeedback,
    lable: "Feedback",
    nav: "feedback",
    link: "/admin/feedback",
  },
  // {
  //   icon: MdNotificationsActive,
  //   lable: "Notifications",
  //   nav: "notifications",
  //   link: "/admin/notifications",
  // },
  {
    icon: IoSettings,
    lable: "Settings",
    nav: "settings",
    link: "/admin/settings",
  },
  

];
