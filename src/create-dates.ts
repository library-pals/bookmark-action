export function createDates(date?: string): {
  shortDate: string;
  timestamp: string;
} {
  const shortDate = date || new Date().toISOString().slice(0, 10);
  const timestamp = new Date()
    .toISOString()
    .replace(/\d{4}-\d{2}-\d{2}/, shortDate);
  return {
    shortDate,
    timestamp,
  };
}
