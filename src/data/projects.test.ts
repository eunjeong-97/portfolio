import { describe, it, expect } from "vitest";
import { projects } from "./projects";
import { experiences } from "./experiences";
import { parsePeriod, getDuration } from "@/utils/periodUtils";

const PERIOD_REGEX = /^\d{4}\.\d{2} - \d{4}\.\d{2}/;

describe("projects data", () => {
  it("has at least one project", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it("every project has required string fields", () => {
    for (const project of projects) {
      expect(typeof project.id).toBe("string");
      expect(project.id.length).toBeGreaterThan(0);
      expect(typeof project.title).toBe("string");
      expect(project.title.length).toBeGreaterThan(0);
      expect(typeof project.problem).toBe("string");
      expect(project.problem.length).toBeGreaterThan(0);
      expect(typeof project.decision).toBe("string");
      expect(project.decision.length).toBeGreaterThan(0);
      expect(typeof project.impact).toBe("string");
      expect(project.impact.length).toBeGreaterThan(0);
      expect(typeof project.role).toBe("string");
      expect(project.role.length).toBeGreaterThan(0);
    }
  });

  it("every project id is unique", () => {
    const ids = projects.map((p) => p.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("every project has at least one tag", () => {
    for (const project of projects) {
      expect(project.tags.length).toBeGreaterThan(0);
    }
  });

  it("every project has at least one highlight", () => {
    for (const project of projects) {
      expect(project.highlights.length).toBeGreaterThan(0);
    }
  });

  it("every highlight string is non-empty", () => {
    for (const project of projects) {
      for (const highlight of project.highlights) {
        expect(typeof highlight).toBe("string");
        expect(highlight.length).toBeGreaterThan(0);
      }
    }
  });

  it("every project tag string is non-empty", () => {
    for (const project of projects) {
      for (const tag of project.tags) {
        expect(typeof tag).toBe("string");
        expect(tag.length).toBeGreaterThan(0);
      }
    }
  });

  it("every project period matches YYYY.MM - YYYY.MM format", () => {
    for (const project of projects) {
      expect(PERIOD_REGEX.test(project.period)).toBe(true);
    }
  });

  it("every project period is parseable by parsePeriod (handles annotation suffixes)", () => {
    for (const project of projects) {
      const parsed = parsePeriod(project.period);
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

  it("getDuration returns a non-empty label for every project period", () => {
    for (const project of projects) {
      expect(getDuration(project.period).length).toBeGreaterThan(0);
    }
  });

  it("every project id matches an experience id (projects are featured experiences)", () => {
    const expIds = new Set(experiences.map((e) => e.id));
    for (const project of projects) {
      expect(expIds.has(project.id)).toBe(true);
    }
  });

  it("every project period has start date not after end date", () => {
    for (const project of projects) {
      const parsed = parsePeriod(project.period)!;
      const [sy, sm, ey, em] = parsed;
      const startMonths = sy * 12 + sm;
      const endMonths = ey * 12 + em;
      expect(endMonths).toBeGreaterThanOrEqual(startMonths);
    }
  });

  it("tags within each project are unique (no duplicate tags)", () => {
    for (const project of projects) {
      const unique = new Set(project.tags);
      expect(unique.size).toBe(project.tags.length);
    }
  });

  it("highlights within each project are unique (no duplicate highlights)", () => {
    for (const project of projects) {
      const unique = new Set(project.highlights);
      expect(unique.size).toBe(project.highlights.length);
    }
  });

  it("has exactly 3 projects", () => {
    expect(projects.length).toBe(3);
  });

  it("project titles are all unique (no two projects share the same title)", () => {
    const titles = projects.map((p) => p.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("every project period contains a · annotation suffix", () => {
    for (const project of projects) {
      expect(project.period).toContain("·");
    }
  });

  it("every project id is kebab-case (lowercase letters, digits, and hyphens only)", () => {
    for (const project of projects) {
      expect(project.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("project order matches the order projects appear (stable, deterministic listing)", () => {
    const ids = projects.map((p) => p.id);
    expect(ids).toEqual(["app-rebuild", "sdk-integration", "admob-bidding"]);
  });
});
