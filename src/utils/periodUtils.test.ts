import { describe, it, expect } from "vitest";
import { parsePeriod, getDuration } from "./periodUtils";

describe("parsePeriod", () => {
  it("parses a valid period string into [sy, sm, ey, em]", () => {
    expect(parsePeriod("2022.03 - 2024.10")).toEqual([2022, 3, 2024, 10]);
  });

  it("returns null when there is no separator", () => {
    expect(parsePeriod("2022.03")).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(parsePeriod("")).toBeNull();
  });

  it("handles single-digit months", () => {
    expect(parsePeriod("2023.01 - 2023.09")).toEqual([2023, 1, 2023, 9]);
  });

  it("strips '· N개월' annotation suffix from the end date", () => {
    expect(parsePeriod("2022.09 - 2022.12 · 3개월")).toEqual([2022, 9, 2022, 12]);
  });

  it("strips '· 약 N년' annotation suffix from the end date", () => {
    expect(parsePeriod("2023.08 - 2024.10 · 약 1년")).toEqual([2023, 8, 2024, 10]);
  });

  it("returns null when the date segments are not numbers", () => {
    expect(parsePeriod("abc - def")).toBeNull();
  });

  it("returns null when the separator has no surrounding spaces", () => {
    expect(parsePeriod("2022.03-2024.10")).toBeNull();
  });

  it("handles leading/trailing whitespace around the separator", () => {
    expect(parsePeriod("  2022.03 - 2024.10  ")).toEqual([2022, 3, 2024, 10]);
  });
});

describe("getDuration", () => {
  it("returns months-only label when total is less than 12", () => {
    expect(getDuration("2022.03 - 2022.08")).toBe("6개월");
  });

  it("returns years-only label when the month remainder is 0", () => {
    expect(getDuration("2022.01 - 2022.12")).toBe("1년");
  });

  it("returns combined years and months when there is a remainder", () => {
    expect(getDuration("2022.03 - 2023.08")).toBe("1년 6개월");
  });

  it("counts start and end months inclusively (single month = 1개월)", () => {
    expect(getDuration("2022.03 - 2022.03")).toBe("1개월");
  });

  it("returns an empty string for an invalid period", () => {
    expect(getDuration("invalid")).toBe("");
  });

  it("handles multi-year durations", () => {
    expect(getDuration("2020.01 - 2022.12")).toBe("3년");
  });

  it("correctly computes duration when period has a · annotation suffix", () => {
    expect(getDuration("2022.09 - 2022.12 · 3개월")).toBe("4개월");
  });

  it("returns an empty string when the end date is before the start date", () => {
    expect(getDuration("2022.12 - 2022.03")).toBe("");
  });

  it("returns '2년' for exactly 24 months (2020.01 - 2021.12)", () => {
    // (2021-2020)*12 + (12-1) + 1 = 24, 24/12 = 2 years with no remainder
    expect(getDuration("2020.01 - 2021.12")).toBe("2년");
  });

  it("returns '1년 1개월' for a 13-month span (2022.01 - 2023.01)", () => {
    // (2023-2022)*12 + (1-1) + 1 = 13 months → 1년 1개월
    expect(getDuration("2022.01 - 2023.01")).toBe("1년 1개월");
  });
});

describe("parsePeriod — edge cases", () => {
  it("parses the first two date parts when the string contains multiple ' - ' separators", () => {
    // split(" - ") yields 3+ parts; only parts[0] and parts[1] are used
    expect(parsePeriod("2022.03 - 2024.10 - extra")).toEqual([2022, 3, 2024, 10]);
  });

  it("returns null when the end date part is empty (trailing ' - ')", () => {
    // parts[1] = "" → endPart = "" → split(".") → [""] → Number("") = NaN → null
    expect(parsePeriod("2022.03 - ")).toBeNull();
  });

  it("returns null when the start date has no month (no dot in first part)", () => {
    // parts[0] = "2022" → split(".") → ["2022"] → sm = undefined → NaN → null
    expect(parsePeriod("2022 - 2024.10")).toBeNull();
  });

  it("returns null when the end date has no month (no dot in second part)", () => {
    // parts[1] = "2024" → split(".") → ["2024"] → em = undefined → NaN → null
    expect(parsePeriod("2022.03 - 2024")).toBeNull();
  });
});
