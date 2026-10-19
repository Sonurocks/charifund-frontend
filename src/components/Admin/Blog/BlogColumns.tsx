'use client';

import React from "react";
import { Blog, BlogColumnCallbacks } from "@/src/types/admin/blog";
import TableRowActions from "../Campaign/CampaignActions";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export const getBlogColumns = ({
  onEdit,
  onDelete,
  onView,
}: BlogColumnCallbacks) => [
  { name: "SNo", cell: (_row: Blog, index: number) => index + 1, width: "80px" },
  { name: "Creator", selector: (row: Blog) => (row.creator as any)?.en || row.creator },
  { name: "Title", selector: (row: Blog) => (row.title as any)?.en || row.title },
  { name: "Category", selector: (row: Blog) => (row.category as any)?.name?.en || (row.category as any)?.en || row.category },
  { name: "Location", selector: (row: Blog) => (row.location as any)?.en || row.location },
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
        row={row as any}
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
        ] as any}
      />
    ),
  },
];
