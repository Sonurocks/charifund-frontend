import React from "react";
import { Event, EventColumnCallbacks } from "../types/event";
import { CampaignColumnCallbacks } from "@/src/types/campaign";
import TableRowActions from "./EventActions";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";



export const getEventColumns = ({
  onEdit,
  onDelete,
  onView,
}: EventColumnCallbacks) => [
    { name: "SNo", cell: (_row: Event, index: number) => index + 1, width: "80px" },
    { name: "Title", selector: (row: Event) => row.title, sortable: true },
    { name: "Date", selector: (row: Event) => row.Date },
    { name: "Start Time", selector: (row: Event) => row.startTime },
    {
      name: "End Time",
      selector: (row: Event) => `${row.endTime}`,
    },
    { name: "Location", selector: (row: Event) => row.location },
    { name: "Status", selector: (row: Event) => row.status },
    {
      name: "Actions",
      cell: (row: Event) => (
        <TableRowActions
          row={row}
          actions={[
            { label: "View Event", icon: <FaEye />, onClick: onView, colorClass: "text-blue-500 hover:text-blue-700" },
            { label: "Edit Event", icon: <FaEdit />, onClick: onEdit, colorClass: "text-green-500 hover:text-green-700" },
            { label: "Delete Event", icon: <FaTrash />, onClick: onDelete, colorClass: "text-red-500 hover:text-red-700" },
          ]}
        />
      ),
    },
  ];
