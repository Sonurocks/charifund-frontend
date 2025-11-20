import { IconType } from "react-icons";

interface FieldBoxProps {
  icon: IconType;            // react-icons component
  label: string;
  value: string;
  onClick?: () => void;
  className?: string;
  iconSize?: number;         // optional icon size control
  error?: string;
  readOnly?: boolean;
}

const FieldBox: React.FC<FieldBoxProps> = ({
  icon: Icon,
  label,
  value,
  onClick,
  className = "",
  iconSize = 18,
  error,
  readOnly = false,
}) => {
  return (
    <div className={`w-full  ${className}`}>
      {/* Label */}
      <label className="block font-medium text-blue-50 text-[14px] ">
        {label}
      </label>

      {/* Input-like container */}
      <div
        onClick={readOnly ? undefined : onClick}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-md 
          bg-gray-200/60 cursor-pointer
          ${error ? "border-red" : "border-transparent"}
          ${readOnly ? "cursor-not-allowed bg-gray-50" : "hover:border-gray-300"}
        `}
      >
        {/* Icon */}
        <div className="text-gray-500">
          <Icon size={iconSize} />
        </div>

        {/* Value */}
        <span
          className={`text-[13px] text-foreground/70 ${
            !value ? "text-gray-500" : "text-gray-900 font-medium"
          }`}
        >
          {value ||
            (label === "Date" || label === "तिथि"
              ? "Select date"
              : "Select time")}
        </span>
      </div>

      {/* Error */}
      {error && <p className="text-[10px] text-red mt-1">{error}</p>}
    </div>
  );
};

export default FieldBox;
