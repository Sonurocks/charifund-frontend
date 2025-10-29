'use client';

import React from "react";
import dynamic from "next/dynamic";
import { Blog, BlogColumnCallbacks } from "@/src/types/admin/blog";

//  Dynamically import TableRowActions
const TableRowActions = dynamic(() => import("../Campaign/CampaignActions"), {
  loading: () => <span>Loading actions...</span>,
});

//  Dynamically import icons
const FaEye = dynamic(() => import("react-icons/fa").then((mod) => mod.FaEye));
const FaEdit = dynamic(() => import("react-icons/fa").then((mod) => mod.FaEdit));
const FaTrash = dynamic(() => import("react-icons/fa").then((mod) => mod.FaTrash));

export const getBlogColumns = ({
  onEdit,
  onDelete,
  onView,
}: BlogColumnCallbacks) => [
  { name: "SNo", cell: (_row: Blog, index: number) => index + 1, width: "80px" },
  { name: "Creator", selector: (row: Blog) => row.creator },
  { name: "Title", selector: (row: Blog) => row.title },
  { name: "Category", selector: (row: Blog) => row.category },
  { name: "Location", selector: (row: Blog) => row.location },
  {
    name: "Created",
    selector: (row: Blog) =>
      row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-",
  },
  {
    name: "Updated",
    selector: (row: Blog) =>
      row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : "-",
  },
  {
    name: "Actions",
    cell: (row: Blog) => (
      <TableRowActions
        row={row}
        actions={[
          {
            label: "View Blog",
            icon: <FaEye />,
            onClick: onView,
            colorClass: "text-blue-500 hover:text-blue-700",
          },
          {
            label: "Edit Blog",
            icon: <FaEdit />,
            onClick: onEdit,
            colorClass: "text-green-500 hover:text-green-700",
          },
          {
            label: "Delete Blog",
            icon: <FaTrash />,
            onClick: onDelete,
            colorClass: "text-red-500 hover:text-red-700",
          },
        ]}
      />
    ),
  },
];


