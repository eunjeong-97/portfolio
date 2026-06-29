import { describe, it, expect } from "vitest";
import { projects } from "./projects";

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
});
