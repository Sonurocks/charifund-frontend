const formatLocalDateTime = (date?: Date | null, time?: Date | null) => {
  if (!date || !time) return "";
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  const h = time.getHours().toString().padStart(2, "0");
  const min = time.getMinutes().toString().padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${min}:00`;
};

export default formatLocalDateTime;