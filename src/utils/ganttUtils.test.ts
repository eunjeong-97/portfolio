import { describe, it, expect } from "vitest";
import { getBarProps, CAREER_START, CAREER_END, TOTAL_MONTHS } from "./ganttUtils";

describe("TOTAL_MONTHS", () => {
  it("correctly spans CAREER_START through CAREER_END inclusive", () => {
    const [sy, sm] = CAREER_START;
    const [ey, em] = CAREER_END;
    const expected = (ey - sy) * 12 + (em - sm) + 1;
    expect(TOTAL_MONTHS).toBe(expected);
  });

  it("equals 32 for the 2022.03 – 2024.10 range", () => {
    expect(TOTAL_MONTHS).toBe(32);
  });
});

describe("getBarProps", () => {
  it("returns { left: 0, width: 0 } for an invalid period", () => {
    expect(getBarProps("not-a-period")).toEqual({ left: 0, width: 0 });
  });

  it("returns { left: 0, width: 0 } for an empty string", () => {
    expect(getBarProps("")).toEqual({ left: 0, width: 0 });
  });

  it("starts at left=0 for a period beginning at CAREER_START", () => {
    const { left } = getBarProps("2022.03 - 2022.06");
    expect(left).toBe(0);
  });

  it("spans the full 100% for a period covering the entire career range", () => {
    const { left, width } = getBarProps("2022.03 - 2024.10");
    expect(left).toBe(0);
    expect(width).toBeCloseTo(100, 5);
  });

  it("computes correct left offset for a mid-career start", () => {
    // 2023.03 is 12 months after CAREER_START
    const { left } = getBarProps("2023.03 - 2023.06");
    expect(left).toBeCloseTo((12 / TOTAL_MONTHS) * 100, 5);
  });

  it("computes correct width for a known period", () => {
    // 2023.03 (offset 12) – 2023.08 (offset 17) → width = 6 months
    const { width } = getBarProps("2023.03 - 2023.08");
    expect(width).toBeCloseTo((6 / TOTAL_MONTHS) * 100, 5);
  });

  it("returns width for a single-month period (1 / TOTAL_MONTHS * 100)", () => {
    const { width } = getBarProps("2022.03 - 2022.03");
    expect(width).toBeCloseTo((1 / TOTAL_MONTHS) * 100, 5);
  });

  it("handles annotation suffixes like '· 3개월'", () => {
    const { left, width } = getBarProps("2022.09 - 2022.12 · 3개월");
    expect(left).toBeCloseTo((6 / TOTAL_MONTHS) * 100, 5);
    expect(width).toBeCloseTo((4 / TOTAL_MONTHS) * 100, 5);
  });

  it("returns a negative left for a period starting before CAREER_START", () => {
    // 2021.01 is 14 months before CAREER_START (2022.03) — no clamping applied
    const { left } = getBarProps("2021.01 - 2022.06");
    expect(left).toBeLessThan(0);
  });

  it("left and width together do not exceed 100% for any real experience period", () => {
    const periods = [
      "2022.03 - 2024.10 · 약 2년",
      "2022.09 - 2022.12 · 3개월",
      "2023.01 - 2023.07 · 7개월",
    ];
    for (const p of periods) {
      const { left, width } = getBarProps(p);
      expect(left + width).toBeLessThanOrEqual(100 + 1e-9);
    }
  });
});
