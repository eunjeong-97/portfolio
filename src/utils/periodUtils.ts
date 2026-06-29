export function parsePeriod(period: string): [number, number, number, number] | null {
  const parts = period.split(" - ").map(s => s.trim());
  if (parts.length < 2) return null;
  const [sy, sm] = parts[0].split(".").map(Number);
  const endPart = parts[1].split(" · ")[0].trim();
  const [ey, em] = endPart.split(".").map(Number);
  if ([sy, sm, ey, em].some(isNaN)) return null;
  return [sy, sm, ey, em];
}

export function getDuration(period: string): string {
  const parsed = parsePeriod(period);
  if (!parsed) return "";
  const [sy, sm, ey, em] = parsed;
  const totalMonths = (ey - sy) * 12 + (em - sm) + 1;
  if (totalMonths < 12) return `${totalMonths}개월`;
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return months > 0 ? `${years}년 ${months}개월` : `${years}년`;
}
