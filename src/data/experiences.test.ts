import { describe, it, expect } from "vitest";
import { experiences } from "./experiences";
import { parsePeriod, getDuration } from "@/utils/periodUtils";

describe("experiences data", () => {
  it("has at least one experience", () => {
    expect(experiences.length).toBeGreaterThan(0);
  });

  it("every experience has required string fields", () => {
    for (const exp of experiences) {
      expect(typeof exp.id).toBe("string");
      expect(exp.id.length).toBeGreaterThan(0);
      expect(typeof exp.title).toBe("string");
      expect(exp.title.length).toBeGreaterThan(0);
      expect(typeof exp.description).toBe("string");
      expect(exp.description.length).toBeGreaterThan(0);
    }
  });

  it("every experience id is unique", () => {
    const ids = experiences.map((e) => e.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("every experience period is parseable by parsePeriod", () => {
    for (const exp of experiences) {
      const parsed = parsePeriod(exp.period);
      expect(parsed).not.toBeNull();
      const [sy, sm, ey, em] = parsed!;
      expect(sy).toBeGreaterThanOrEqual(2000);
      expect(sm).toBeGreaterThanOrEqual(1);
      expect(sm).toBeLessThanOrEqual(12);
      expect(ey).toBeGreaterThanOrEqual(sy);
      expect(em).toBeGreaterThanOrEqual(1);
      expect(em).toBeLessThanOrEqual(12);
    }
  });

  it("every experience has at least one tag", () => {
    for (const exp of experiences) {
      expect(exp.tags.length).toBeGreaterThan(0);
    }
  });

  it("every experience has at least one detail", () => {
    for (const exp of experiences) {
      expect(exp.details.length).toBeGreaterThan(0);
    }
  });

  it("every detail string is non-empty", () => {
    for (const exp of experiences) {
      for (const detail of exp.details) {
        expect(typeof detail).toBe("string");
        expect(detail.length).toBeGreaterThan(0);
      }
    }
  });

  it("every tag string is non-empty", () => {
    for (const exp of experiences) {
      for (const tag of exp.tags) {
        expect(typeof tag).toBe("string");
        expect(tag.length).toBeGreaterThan(0);
      }
    }
  });

  it("experiences are sorted newest-first (descending start date)", () => {
    const startDates = experiences.map((exp) => {
      const parsed = parsePeriod(exp.period)!;
      return parsed[0] * 12 + parsed[1];
    });
    for (let i = 1; i < startDates.length; i++) {
      expect(startDates[i]).toBeLessThanOrEqual(startDates[i - 1]);
    }
  });

  it("experience ids and project-like ids have no duplicates within themselves", () => {
    const ids = experiences.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("getDuration returns a non-empty label for every experience period", () => {
    for (const exp of experiences) {
      expect(getDuration(exp.period).length).toBeGreaterThan(0);
    }
  });

  it("videoUrl, when present, is a non-empty string starting with https://", () => {
    for (const exp of experiences) {
      if (exp.videoUrl !== undefined) {
        expect(typeof exp.videoUrl).toBe("string");
        expect(exp.videoUrl.startsWith("https://")).toBe(true);
      }
    }
  });
});
