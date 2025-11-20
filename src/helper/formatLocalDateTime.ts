export const formatIndianDateTime = (dateStr: string) => {
  // Remove trailing 'Z' if present to treat as local time
  const localStr = dateStr.endsWith("Z") ? dateStr.slice(0, -1) : dateStr;
  const date = new Date(localStr);

  const formattedDate = date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${formattedDate} ${formattedTime}`;
};
