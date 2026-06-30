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

  it("calls scrollIntoView exactly once per invocation", () => {
    const el = document.createElement("div");
    el.id = "once";
    el.scrollIntoView = vi.fn();
    document.body.appendChild(el);

    scrollToId("once");

    expect(el.scrollIntoView).toHaveBeenCalledTimes(1);
    document.body.removeChild(el);
  });

  it("selects the element by id and does not affect other elements", () => {
    const el1 = document.createElement("div");
    el1.id = "one";
    el1.scrollIntoView = vi.fn();
    const el2 = document.createElement("div");
    el2.id = "two";
    el2.scrollIntoView = vi.fn();
    document.body.append(el1, el2);

    scrollToId("two");

    expect(el1.scrollIntoView).not.toHaveBeenCalled();
    expect(el2.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
    document.body.removeChild(el1);
    document.body.removeChild(el2);
  });
});
