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
});
