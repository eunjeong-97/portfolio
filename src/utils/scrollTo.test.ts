// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { scrollToId } from "./scrollTo";

describe("scrollToId", () => {
  it("calls scrollIntoView on the matching element", () => {
    const el = document.createElement("div");
    el.id = "target";
    el.scrollIntoView = vi.fn();
    document.body.appendChild(el);

    scrollToId("target");

    expect(el.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
    document.body.removeChild(el);
  });

  it("does not throw when the element does not exist", () => {
    expect(() => scrollToId("nonexistent-id")).not.toThrow();
  });

  it("does not throw when called with an empty string id", () => {
    expect(() => scrollToId("")).not.toThrow();
  });
});
