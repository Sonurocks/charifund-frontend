


"use client";

import React from "react";
import dynamic from "next/dynamic";
import AnimatedReveal from "@/src/animations/AnimatedReveal";
import { AdminDataTableWrapperProps } from "@/src/types/adminCommon";

const DataTable = dynamic(() => import("react-data-table-component"), {
  ssr: false,
  loading: () => <p className="p-4">Loading table...</p>,
});

const DataTableWrapper = <T,>({
  columns,
  data,
  loading = false,
}: AdminDataTableWrapperProps<T>) => {
  //  Defensive check
  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeData = Array.isArray(data) ? data : [];

  return (
    <AnimatedReveal>
      <DataTable
        columns={safeColumns}
        data={safeData}
        progressPending={loading}
        progressComponent={<p className="p-4">Loading...</p>}
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





