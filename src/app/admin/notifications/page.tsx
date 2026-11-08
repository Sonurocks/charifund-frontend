import React from "react";
import NotificationsComponent from "@/src/components/Admin/Notifications";

export const metadata = {
  title: "Admin Notifications | GiveSphere",
  description: "View real-time notifications for donations, pledges, and inquiries",
};

export default function NotificationsPage() {
  return <NotificationsComponent />;
}
