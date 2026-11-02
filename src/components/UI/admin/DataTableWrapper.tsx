"use client";

import React from "react";
import dynamic from "next/dynamic";
import { TableProps } from "react-data-table-component";
import { Icon } from "@iconify/react";
import AnimatedReveal from "@/src/animations/AnimatedReveal";
import { AdminDataTableWrapperProps } from "@/src/types/admin";

const DataTable = dynamic<TableProps<any>>(
  () =>
    import("react-data-table-component").then(
      (mod: any) => mod?.default?.default || mod?.default || mod
    ),
  {
    ssr: false,
    loading: () => <TableSpinner />,
  }
);

const TableSpinner = () => (
  <div className="flex items-center justify-center p-8 text-primaryColor">
    <Icon icon="eos-icons:loading" width={28} height={28} className="animate-spin" />
  </div>
);

const DataTableWrapper = <T,>({
  columns,
  data,
  loading = false,
  conditionalRowStyles,
}: AdminDataTableWrapperProps<T>) => {
  // Defensive check & stripping of properties that React 19 forwards to DOM elements
  const safeColumns = Array.isArray(columns)
    ? columns.map((col: any) => {
        if (!col || typeof col !== "object") return col;
        const { allowOverflow, ignoreRowClick, button, ...rest } = col;
        return rest;
      })
    : [];
  const safeData = Array.isArray(data) ? data : [];
  return (
    <AnimatedReveal>
      <div className="w-full max-w-full overflow-x-auto rounded-xl">
        <DataTable
          columns={safeColumns as any}
          data={safeData}
          conditionalRowStyles={conditionalRowStyles}
          progressPending={loading}
          progressComponent={<TableSpinner />}
          highlightOnHover
          striped
          responsive
          customStyles={{
            table: {
              style: {
                width: "100%",
                minWidth: "100%",
              },
            },
            tableWrapper: {
              style: {
                width: "100%",
                minWidth: "100%",
                display: "block",
              },
            },
            headRow: {
              style: {
                backgroundColor: "var(--color-primaryColor)",
                borderTopLeftRadius: "0.75rem",
                borderTopRightRadius: "0.75rem",
                minHeight: "44px",
              },
            },
            headCells: {
              style: {
                fontWeight: 600,
                fontSize: "13px",
                backgroundColor: "var(--color-primaryColor)",
                color: "var(--color-foreground)",
              },
            },
            cells: {
              style: {
                fontSize: "12px",
                fontWeight: 500,
              },
            },
            rows: {
              style: {
                minHeight: "44px",
              },
            },
          }}
        />
      </div>
    </AnimatedReveal>
  );
};

export default DataTableWrapper;
