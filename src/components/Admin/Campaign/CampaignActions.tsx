

"use client";

import React from "react";
import dynamic from "next/dynamic";
import { TableRowActionsProps } from "@/src/types/admin/campaign";

const Tooltip = dynamic(() => import("@mui/material/Tooltip"), {
  ssr: false,
  loading: () => <span className="text-gray-400 text-xs">...</span>,
});

const TableRowActions = <RowType,>({
  row,
  actions,
  className = "",
}: TableRowActionsProps<RowType>) => {
  return (
    <div className={`flex gap-3 ${className}`}>
      {actions.map((action, index) => (
        <Tooltip key={index} title={action.label}>
          <button
            onClick={() => action.onClick(row)}
            className={`cursor-pointer ${
              action.colorClass || "text-gray-600 hover:text-gray-900"
            }`}
          >
            {action.icon}
          </button>
        </Tooltip>
      ))}
    </div>
  );
};

export default TableRowActions;

