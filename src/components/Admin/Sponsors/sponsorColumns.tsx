import React from "react";
import Image from "next/image";
import { FaEdit, FaEye, FaTrash, FaExternalLinkAlt } from "react-icons/fa";
import TableRowActions from "../Campaign/CampaignActions";
import { AdminSponsor, SponsorColumnCallbacks } from "@/src/types/admin/sponsor";

const getLocalizedString = (
  value: { en?: string; hi?: string } | string | undefined,
  fallback = "-"
): string => {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return value.en || value.hi || fallback;
};

export const getSponsorColumns = ({
  onEdit,
  onDelete,
  onView,
}: SponsorColumnCallbacks) => [
  {
    name: "SNo",
    cell: (_row: AdminSponsor, index: number) => index + 1,
    width: "70px",
  },
  {
    name: "Logo",
    cell: (row: AdminSponsor) => {
      const logoSrc = row.logo || "/assets/aboutus.webp";
      return (
        <div className="relative w-12 h-10 bg-gray-50 border border-gray-200 rounded p-1 flex items-center justify-center overflow-hidden my-1">
          <Image
            src={logoSrc}
            alt={getLocalizedString(row.name, "Sponsor")}
            width={48}
            height={36}
            className="object-contain max-h-full max-w-full"
          />
        </div>
      );
    },
    width: "90px",
  },
  {
    name: "Name",
    selector: (row: AdminSponsor) => getLocalizedString(row.name),
    sortable: true,
  },
  {
    name: "Category",
    cell: (row: AdminSponsor) => (
      <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-green/10 text-dark-green">
        {getLocalizedString(row.category)}
      </span>
    ),
    sortable: true,
  },
  {
    name: "Location",
    selector: (row: AdminSponsor) => getLocalizedString(row.location),
  },
  {
    name: "Website",
    cell: (row: AdminSponsor) =>
      row.website ? (
        <a
          href={row.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1.5 font-medium underline"
        >
          <span>Visit</span>
          <FaExternalLinkAlt className="w-2.5 h-2.5" />
        </a>
      ) : (
        <span className="text-gray-400 text-xs">-</span>
      ),
  },
  {
    name: "Actions",
    cell: (row: AdminSponsor) => (
      <TableRowActions
        row={row as any}
        actions={[
          ...(onView
            ? [
                {
                  label: "View Sponsor",
                  icon: <FaEye />,
                  onClick: onView,
                  colorClass: "text-blue-500 hover:text-blue-700",
                },
              ]
            : []),
          {
            label: "Edit Sponsor",
            icon: <FaEdit />,
            onClick: onEdit,
            colorClass: "text-green-500 hover:text-green-700",
          },
          {
            label: "Delete Sponsor",
            icon: <FaTrash />,
            onClick: onDelete,
            colorClass: "text-red-500 hover:text-red-700",
          },
        ]}
      />
    ),
  },
];
