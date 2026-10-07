import React from "react";
import TableRowActions from "./EventActions";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Event, EventColumnCallbacks } from "@/src/types/admin/event";



export const getEventColumns = ({
  onEdit,
  onDelete,
  onView,
}: EventColumnCallbacks) => [
    { name: "SNo", cell: (_row: Event, index: number) => index + 1, width: "80px" },
    { name: "Title", selector: (row: Event) => row.title?.en || "", sortable: true },
    { name: "Start Date", selector: (row: Event) => row.startDate, width: "170px" },
    { name: "End Date", selector: (row: Event) => row.endDate , width: "170px"},
    { name: "Location", selector: (row: Event) => row.location?.en || "" },
    { name: "Status", selector: (row: Event) => row.status },
    {
      name: "Actions",
      cell: (row: Event) => (
        <TableRowActions
          row={row as any}
          actions={[
            { label: "View Event", icon: <FaEye />, onClick: onView, colorClass: "text-blue-500 hover:text-blue-700" },
            { label: "Edit Event", icon: <FaEdit />, onClick: onEdit, colorClass: "text-green-500 hover:text-green-700" },
            { label: "Delete Event", icon: <FaTrash />, onClick: onDelete, colorClass: "text-red-500 hover:text-red-700" },
          ] as any}
        />
      ),
    },
  ];
