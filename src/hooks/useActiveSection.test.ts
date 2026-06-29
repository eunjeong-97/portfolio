// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useActiveSection } from "./useActiveSection";

type IOCallback = (entries: IntersectionObserverEntry[]) => void;
const elementCallbacks = new Map<Element, IOCallback>();

class MockIntersectionObserver {
  constructor(private cb: IOCallback) {}
  observe(el: Element) { elementCallbacks.set(el, this.cb); }
  unobserve(el: Element) { elementCallbacks.delete(el); }
  disconnect() { elementCallbacks.clear(); }
}

function triggerIntersection(el: Element, isIntersecting: boolean) {
  act(() => {
    elementCallbacks.get(el)?.([{ isIntersecting, target: el } as IntersectionObserverEntry]);
  });
}

beforeEach(() => {
  elementCallbacks.clear();
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

describe("useActiveSection", () => {
  it("starts with an empty active section", () => {
    const { result } = renderHook(() => useActiveSection(["about", "contact"]));
    expect(result.current).toBe("");
  });

  it("sets the active section when its element becomes intersecting", () => {
    const el = document.createElement("section");
    el.id = "about";
    document.body.appendChild(el);

    const { result } = renderHook(() => useActiveSection(["about"]));
    triggerIntersection(el, true);
    expect(result.current).toBe("about");
  });

  it("does not update active section when an element stops intersecting", () => {
    const el = document.createElement("section");
    el.id = "about";
    document.body.appendChild(el);

    const { result } = renderHook(() => useActiveSection(["about"]));
    triggerIntersection(el, true);
    expect(result.current).toBe("about");
    triggerIntersection(el, false);
    expect(result.current).toBe("about");
  });

  it("switches active section when a different section intersects", () => {
    const el1 = document.createElement("section");
    el1.id = "about";
    const el2 = document.createElement("section");
    el2.id = "contact";
    document.body.append(el1, el2);

    const { result } = renderHook(() => useActiveSection(["about", "contact"]));
    triggerIntersection(el1, true);
    expect(result.current).toBe("about");
    triggerIntersection(el2, true);
    expect(result.current).toBe("contact");
  });

  it("skips section IDs that have no matching DOM element", () => {
    const el = document.createElement("section");
    el.id = "real";
    document.body.appendChild(el);

    const { result } = renderHook(() => useActiveSection(["ghost", "real"]));
    triggerIntersection(el, true);
    expect(result.current).toBe("real");
  });

  it("stays empty and does not throw when sectionIds is empty", () => {
    const { result } = renderHook(() => useActiveSection([]));
    expect(result.current).toBe("");
  });

  it("updates through multiple sections as each intersects in turn", () => {
    const el1 = document.createElement("section");
    el1.id = "about";
    const el2 = document.createElement("section");
    el2.id = "contact";
    const el3 = document.createElement("section");
    el3.id = "projects";
    document.body.append(el1, el2, el3);

    const { result } = renderHook(() => useActiveSection(["about", "contact", "projects"]));
    triggerIntersection(el1, true);
    expect(result.current).toBe("about");
    triggerIntersection(el2, true);
    expect(result.current).toBe("contact");
    triggerIntersection(el3, true);
    expect(result.current).toBe("projects");
    document.body.removeChild(el1);
    document.body.removeChild(el2);
    document.body.removeChild(el3);
  });

  it("does not change active section when the same element fires isIntersecting again", () => {
    const el = document.createElement("section");
    el.id = "about";
    document.body.appendChild(el);

    const { result } = renderHook(() => useActiveSection(["about"]));
    triggerIntersection(el, true);
    expect(result.current).toBe("about");
    triggerIntersection(el, true); // fires again (e.g., scroll bounce)
    expect(result.current).toBe("about");
    document.body.removeChild(el);
  });

  it("cleans up observers on unmount without throwing", () => {
    const el = document.createElement("section");
    el.id = "about";
    document.body.appendChild(el);

    const { unmount } = renderHook(() => useActiveSection(["about"]));
    expect(() => unmount()).not.toThrow();
  });

  it("does not register any observer when all sectionIds are absent from the DOM", () => {
    renderHook(() => useActiveSection(["ghost1", "ghost2"]));
    expect(elementCallbacks.size).toBe(0);
  });

  it("registers the section element in the callbacks map after initial render", () => {
    const el = document.createElement("section");
    el.id = "skills";
    document.body.appendChild(el);

    renderHook(() => useActiveSection(["skills"]));
    expect(elementCallbacks.has(el)).toBe(true);
    document.body.removeChild(el);
  });
});
