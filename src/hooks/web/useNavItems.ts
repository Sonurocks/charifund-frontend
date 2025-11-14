import { NavItem } from "@/src/types/web/navbar";
import { useTranslation } from "react-i18next";



export const useNavItems = (): NavItem[] => {
  const { t } = useTranslation();

  return [
    { label: t("Home"), href: "/" },
    { label: t("About Us"), href: "/about" },
    { label: t("Campaign"), href: "/campaign" },
    {
      label: t("Pages"),
      dropdown: [
        { label: t("FAQ"), href: "/faq" },
        { label: t("Donate Us"), href: "/donate-us" },
        { label: t("Become Volunteer"), href: "/volunteer" },
        { label: t("Events"), href: "/events" },
        { label: t("Team"), href: "/team" },
      ],
    },
    { label: t("Blog"), href: "/blog" },
    { label: t("Contact Us"), href: "/contact" },
  ];
};
