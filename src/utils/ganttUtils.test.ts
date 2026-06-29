import { describe, it, expect } from "vitest";
import { getBarProps, CAREER_START, CAREER_END, TOTAL_MONTHS } from "./ganttUtils";
import { experiences } from "@/data/experiences";

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

  it("handles '· 약 N년' annotation suffixes (long-form Korean annotation)", () => {
    // Same end date as the bare period — annotation is stripped
    const { left, width } = getBarProps("2022.03 - 2024.10 · 약 2년");
    expect(left).toBe(0);
    expect(width).toBeCloseTo(100, 5);
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

  it("left + width exceeds 100% for a period ending after CAREER_END (no clamping)", () => {
    // 2022.03 - 2025.12 extends 14 months beyond CAREER_END; width > 100%
    const { left, width } = getBarProps("2022.03 - 2025.12");
    expect(left + width).toBeGreaterThan(100);
  });

  it("a period ending exactly at CAREER_END has its right edge at 100%", () => {
    // 2022.03 - 2024.10 spans the full timeline; left=0, left+width=100%
    const { left, width } = getBarProps("2022.03 - 2024.10");
    expect(left + width).toBeCloseTo(100, 5);
  });

  it("returns a negative width for a period where the end date is before the start date", () => {
    const { width } = getBarProps("2024.10 - 2022.03");
    expect(width).toBeLessThan(0);
  });

  it("a single-month period at the last career month ends exactly at 100% of the timeline", () => {
    // startOff = (2024-2022)*12 + (10-3) = 31; endOff = 31
    // left = 31/32*100, width = 1/32*100, left+width = 32/32*100 = 100%
    const { left, width } = getBarProps("2024.10 - 2024.10");
    expect(left + width).toBeCloseTo(100, 5);
    expect(width).toBeCloseTo((1 / TOTAL_MONTHS) * 100, 5);
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

describe("getBarProps — integration with experiences data", () => {
  it("produces non-negative left offset for every real experience period", () => {
    for (const exp of experiences) {
      const { left } = getBarProps(exp.period);
      expect(left).toBeGreaterThanOrEqual(0);
    }
  });

  it("produces left + width ≤ 100% for every real experience period", () => {
    for (const exp of experiences) {
      const { left, width } = getBarProps(exp.period);
      expect(left + width).toBeLessThanOrEqual(100 + 1e-9);
    }
  });
});
