import React from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import TableRowActions from "../Campaign/CampaignActions";
import { Member } from "@/src/types/web/members";
import { MemberColumnCallbacks } from "@/src/types/admin";

export const getMemberColumns = ({
  onEdit,
  onDelete,
  onView,
}: MemberColumnCallbacks) => [
  {
    name: "SNo",
    cell: (_row: Member, index: number) => index + 1,
    width: "80px",
  },
  {
    name: "Name",
    selector: (row: Member) => (typeof row.name === 'string' ? row.name : row.name?.en) || "-",
    sortable: true,
  },
  {
    name: "Position",
    selector: (row: Member) => (typeof row.position === 'string' ? row.position : row.position?.en) || "-",
    sortable: true,
  },
  {
    name: "Title",
    selector: (row: Member) => (typeof row.title === 'string' ? row.title : row.title?.en) || "-",
  },
  {
    name: "Actions",
    cell: (row: Member) => (
      <TableRowActions
        row={row as any}
        actions={[
          ...(onView
            ? [
                {
                  label: "View Member",
                  icon: <FaEye />,
                  onClick: onView,
                  colorClass: "text-blue-500 hover:text-blue-700",
                },
              ]
            : []),
          {
            label: "Edit Member",
            icon: <FaEdit />,
            onClick: onEdit,
            colorClass: "text-green-500 hover:text-green-700",
          },
          {
            label: "Delete Member",
            icon: <FaTrash />,
            onClick: onDelete,
            colorClass: "text-red-500 hover:text-red-700",
          },
        ] as any}
      />
    ),
  },
];
