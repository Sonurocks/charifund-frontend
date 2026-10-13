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
}: AdminDataTableWrapperProps<T>) => {
  // Defensive check
  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeData = Array.isArray(data) ? data : [];
  return (
    <AnimatedReveal>
      <DataTable
        columns={safeColumns as any}
        data={safeData}
        progressPending={loading}
        progressComponent={<TableSpinner />}
        highlightOnHover
        striped
        customStyles={{
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
              minHeight: "40px",
            },
          },
        }}
      />
    </AnimatedReveal>
  );
};

export default DataTableWrapper;
