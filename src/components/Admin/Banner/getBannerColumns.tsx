

"use client";

import React from "react";
import dynamic from "next/dynamic";
import { BannerColumnCallbacks } from "@/src/types/admin";

export interface Banner {
  _id: string;
  title: string | { en?: string };
  subtitle: string | { en?: string };
  priority?: number;
  [key: string]: any;
}


//  Reusable prop type for dynamic component
export type TableRowActionsProps<T> = {
  row: T;
  actions: {
    label: string;
    icon: React.ReactNode;
    onClick: (row: T) => void;
    colorClass?: string;
  }[];
};

//  Dynamic import (type-casted)
const TableRowActions = dynamic(
  () => import("../Campaign/CampaignActions"),
  { loading: () => <span>Loading...</span>, ssr: false }
) as React.ComponentType<TableRowActionsProps<Banner>>;

//  Icons dynamic imports
const FaEye = dynamic(() => import("react-icons/fa").then((mod) => mod.FaEye), { ssr: false });
const FaEdit = dynamic(() => import("react-icons/fa").then((mod) => mod.FaEdit), { ssr: false });
const FaTrash = dynamic(() => import("react-icons/fa").then((mod) => mod.FaTrash), { ssr: false });

//  Column configuration
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
      if (typeof row.title === "object" && row.title !== null) {
        return row.title.en ?? "-";
      }
      return row.title ?? "-";
    },
  },
  {
    name: "Subtitle",
    selector: (row: Banner) => {
      if (typeof row.subtitle === "object" && row.subtitle !== null) {
        return row.subtitle.en ?? "-";
      }
      return row.subtitle ?? "-";
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
        row={row}
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
