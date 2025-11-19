export const mergeDateTime = (date?: Date | null, time?: Date | null) => {
  if (!date) return null;
  if (!time) return date;
  const merged = new Date(date);
  merged.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return merged;
};
