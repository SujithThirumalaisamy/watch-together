export function parseISOTime(isoTime: string) {
  return isoTime
    .replace(/(^PT|S$)/g, "")
    .split(/[^\d]/)
    .map((item) => (item.length < 2 ? "0" + item : item))
    .join(":")
    .replace(/^0/, "");
}
