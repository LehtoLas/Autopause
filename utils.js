export function formatTime() {
  const now = new Date();
  const d = now.toLocaleDateString("fi-FI");
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  return `${d} klo ${h}.${m}`;
}
