import React from "react";
import {  FaEye, FaTrash } from "react-icons/fa";
import TableRowActions from "../Campaign/CampaignActions";
import { Query } from "@/src/types/web/query";
import { Icon } from "@iconify/react";
import { QueryColumnCallbacks } from "@/src/types/admin";

export const getQueryColumns = ({
  onEdit,
  onDelete,
  onView,
}: QueryColumnCallbacks) => [
    {
      name: "SNo",
      cell: (_row: Query, index: number) => index + 1,
      width: "80px",
    },
    {
      name: "Form Type",
      selector: (row: Query) => row.formType || "-",
      sortable: true,
    },
    {
      name: "Email",
      selector: (row: Query) => row.email || "-",
      sortable: true,
      grow:2
    },
    {
      name: "Phone",
      selector: (row: Query) => row.phone || "-",
      sortable: true,
    },
    {
      name: "Message",
      selector: (row: Query) => row.message || "-",
      sortable: true,
      grow:2
    },
    {
      name: "Viewed",
      selector: (row: Query) => {
        return (
          row.isViewed ?
            <span className="flex justify-center items-center gap-[2px]">
              True
              <Icon icon="codex:check" className="size-5 text-lime-green" />
            </span>
            : <span>False</span>

        )
      }
    },
    {
      name: "Actions",
      cell: (row: Query) => (
        <TableRowActions
          row={row}
          actions={[
            ...(onView
              ? [
                {
                  label: "View Query",
                  icon: <FaEye />,
                  onClick: onView,
                  colorClass: "text-blue-500 hover:text-blue-700",
                },
              ]
              : []),
            {
              label: "Delete Query",
              icon: <FaTrash />,
              onClick: onDelete,
              colorClass: "text-red-500 hover:text-red-700",
            },
          ]}
        />
      ),
    },
  ];
