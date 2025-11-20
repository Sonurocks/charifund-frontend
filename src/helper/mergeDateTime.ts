export const mergeDateTime = (date?: Date | null, time?: Date | null): Date | null => {
  if (!date) return null;
  if (!time) return date;

  const merged = new Date(date);

  // Get hours and minutes from time
  const hours = time.getHours();
  const minutes = time.getMinutes();

  // Set time in merged date
  merged.setHours(hours, minutes, 0, 0);

  // Adjust for IST (UTC+5:30)
  const offset = 5.5 * 60; 
  const istDate = new Date(merged.getTime() + offset * 60 * 1000);

  return istDate;
};

