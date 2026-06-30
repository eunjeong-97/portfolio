import { parsePeriod } from "./periodUtils";

export const CAREER_START = [2022, 3] as const;
export const CAREER_END = [2024, 10] as const;
export const TOTAL_MONTHS =
  (CAREER_END[0] - CAREER_START[0]) * 12 + (CAREER_END[1] - CAREER_START[1]) + 1;

export function getBarProps(period: string): { left: number; width: number } {
  const parsed = parsePeriod(period);
  if (!parsed) return { left: 0, width: 0 };
  const [sy, sm, ey, em] = parsed;
  const startOff = (sy - CAREER_START[0]) * 12 + (sm - CAREER_START[1]);
  const endOff = (ey - CAREER_START[0]) * 12 + (em - CAREER_START[1]);
  return {
    left: (startOff / TOTAL_MONTHS) * 100,
    width: ((endOff - startOff + 1) / TOTAL_MONTHS) * 100,
  };
}
