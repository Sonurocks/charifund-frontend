// src/components/Feedback/getFeedbackColumns.ts
import { Feedback, FeedbackColumnCallbacks} from "@/src/types/web/feedback";
import TableRowActions from "../Campaign/CampaignActions";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

export const getFeedbackColumns = ({
  onEdit,
  onDelete,
  onView,
}: FeedbackColumnCallbacks) => [
  {
    name: "SNo",
    cell: (_row: Feedback, index: number) => index + 1,
    width: "80px",
  },
  {
    name: "Name",
    selector: (row: Feedback) => row.name,
    sortable: true,
  },
  {
    name: "Designation",
    selector: (row: Feedback) => row.designation,
    sortable: true,
  },
  {
    name: "Rating",
    selector: (row: Feedback) => row.rating.toString(),
    sortable: true,
  },
  {
    name: "Status",
    selector: (row: Feedback) => row.status,
    sortable: true,
  },
  {
    name: "Actions",
    cell: (row: Feedback) => (
      <TableRowActions
        row={row}
        actions={[
          {
            label: "View Feedback",
            icon: <FaEye />,
            onClick: onView,
            colorClass: "text-blue-500 hover:text-blue-700",
          },
          {
            label: "Edit Feedback",
            icon: <FaEdit />,
            onClick: onEdit,
            colorClass: "text-green-500 hover:text-green-700",
          },
          {
            label: "Delete Feedback",
            icon: <FaTrash />,
            onClick: onDelete,
            colorClass: "text-red-500 hover:text-red-700",
          },
        ]}
      />
    ),
  },
];
