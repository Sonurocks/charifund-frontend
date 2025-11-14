import React from "react";
import { Query, QueryPreviewRowProps } from "@/src/types/web/query";
import Button from "../../UI/web/Buttons/Button";
import ButtonLoader from "../../UI/web/Loader/ButtonLoader";
import { useMarkQueryAsViewed } from "@/src/hooks/admin/useQueries";

const FieldRow = ({ label, value, isLast = false, isBool = false } :QueryPreviewRowProps) => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    (isBool && typeof value !== "boolean")
  )
    return null;

  return (
    <div
      className={`grid grid-cols-3 gap-x-4 md:gap-y-3 text-gray-800 text-[14px] md:text-[16px] ${isLast ? "" : "border-b border-gray-200"
        } py-1 md:py-2`}
    >
      <div className="font-semibold text-gray-700 ">{label}:</div>
      <div className="col-span-2 break-words">
        {isBool ? (value ? "Yes" : "No") : value}
      </div>
    </div>
  );
};

const QueryPreview = ({ data, onClose } : {data:Query, onClose?: () => void}) => {
  const { markQueryAsViewed, isPending } = useMarkQueryAsViewed();

  const {
    id,
    address,
    createdAt,
    email,
    firstName,
    formType,
    isViewed,
    lastName,
    message,
    occupation,
    phone,
  } = data || {};

  const handleMarkAsViewed = () => {
    if (id) {
      markQueryAsViewed({ id, isViewed },

        {
          onSuccess: () => {
            onClose?.();
          },
        }
      );
    }
  };


  if (!data)
    return <div className="text-center text-gray-500 py-6">No data to preview.</div>;

  return (
    <div className="bg-white w-full mx-auto space-y-1 md:space-y-3">
      <FieldRow label="Form Type" value={formType} />
      <FieldRow
        label="Created At"
        value={createdAt ? new Date(createdAt).toLocaleString() : null}
      />
      <FieldRow label="Email" value={email} />
      <FieldRow label="First Name" value={firstName} />
      <FieldRow label="Last Name" value={lastName} />
      <FieldRow label="Address" value={address} />
      <FieldRow label="Phone" value={phone} />
      <FieldRow label="Occupation" value={occupation} />
      <FieldRow label="Message" value={message} />
      <FieldRow label="Viewed" value={isViewed} isBool isLast />

      {/* Mark as Viewed Button */}
      {!isViewed && (
        <div className="pt-4 flex justify-center w-fit">
          <Button
            onClick={handleMarkAsViewed}
            icon="game-icons:check-mark"
          >
            {isPending ? <ButtonLoader /> : "Mark as Viewed"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default QueryPreview;
