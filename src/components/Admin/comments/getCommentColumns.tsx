// src/components/Comments/commentColumns.ts
import { Comment, CommentColumnCallbacks } from "@/src/types/web/comments";
import TableRowActions from "../Campaign/CampaignActions";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

export const getCommentColumns = ({
  onEdit,
  onDelete,
  onView,
}: CommentColumnCallbacks) => [
  {
    name: "SNo",
    cell: (_row: Comment, index: number) => index + 1,
    width: "80px",
  },
   {
    name: "Name",
    selector: (row: Comment) => row.name,
    sortable: true,
  },
  {
    name: "Comment",
    selector: (row: Comment) => row.comment,
    sortable: true,
  },
   {
    name: "Status",
    selector: (row: Comment) => row.status,
    sortable: true,
  },
 
  {
    name: "Actions",
    cell: (row: Comment) => (
      <TableRowActions
        row={row}
        actions={[
          {
            label: "View Comment",
            icon: <FaEye />,
            onClick: onView,
            colorClass: "text-blue-500 hover:text-blue-700",
          },
          {
            label: "Edit Comment",
            icon: <FaEdit />,
            onClick: onEdit,
            colorClass: "text-green-500 hover:text-green-700",
          },
          {
            label: "Delete Comment",
            icon: <FaTrash />,
            onClick: onDelete,
            colorClass: "text-red-500 hover:text-red-700",
          },
        ]}
      />
    ),
  },
];
