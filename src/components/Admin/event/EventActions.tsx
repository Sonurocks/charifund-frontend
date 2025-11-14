
"use client";

import { TableRowActionsProps } from "@/src/types/campaign";
import { Tooltip } from "@mui/material";
import React from "react";



const TableRowActions = <RowType,>({ row, actions, className = "" }: TableRowActionsProps<RowType>) => {
  return (
    <div className={`flex gap-3 ${className}`}>
      {actions.map((action, index) => (
        <Tooltip key={index} title={action.label}>
          <button
            onClick={() => action.onClick(row)}
            className={`cursor-pointer ${action.colorClass || "text-gray-600 hover:text-gray-900"}`}
          >
            {action.icon}
          </button>
        </Tooltip>
      ))}
    </div>
  );
};

export default TableRowActions;
