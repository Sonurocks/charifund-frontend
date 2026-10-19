"use client";

import React from "react";
import { BannerColumnCallbacks } from "@/src/types/admin";
import { Banner } from "@/src/types/admin/banner";
import TableRowActions from "../Campaign/CampaignActions";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

// Reusable prop type for actions component
export type TableRowActionsProps<T> = {
  row: T;
  actions: {
    label: string;
    icon: React.ReactNode;
    onClick: (row: T) => void;
    colorClass?: string;
  }[];
};

// Column configuration
export const getBannerColumns = ({
  onEdit,
  onDelete,
  onView,
}: BannerColumnCallbacks) => [
  {
    name: "SNo",
    cell: (_row: Banner, index: number) => index + 1,
    width: "80px",
  },
  {
    name: "Title",
    selector: (row: Banner) => {
      const title: any = row.title;
      if (typeof title === "object" && title !== null) {
        return title.en ?? "-";
      }
      return title ?? "-";
    },
  },
  {
    name: "Subtitle",
    selector: (row: Banner) => {
      const subtitle: any = row.subtitle;
      if (typeof subtitle === "object" && subtitle !== null) {
        return subtitle.en ?? "-";
      }
      return subtitle ?? "-";
    },
  },
  {
    name: "Priority",
    selector: (row: Banner) => row.priority ?? "-",
  },
  {
    name: "Actions",
    cell: (row: Banner) => (
      <TableRowActions
        row={row as any}
        actions={[
          {
            label: "View Banner",
            icon: <FaEye />,
            onClick: onView,
            colorClass: "text-blue-500 hover:text-blue-700",
          },
          {
            label: "Edit Banner",
            icon: <FaEdit />,
            onClick: onEdit,
            colorClass: "text-green-500 hover:text-green-700",
          },
          {
            label: "Delete Banner",
            icon: <FaTrash />,
            onClick: onDelete,
            colorClass: "text-red-500 hover:text-red-700",
          },
        ]}
      />
    ),
  },
];
