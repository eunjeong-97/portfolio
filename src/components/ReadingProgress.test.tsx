// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import ReadingProgress from "./ReadingProgress";

afterEach(cleanup);

describe("ReadingProgress", () => {
  it("renders a fixed top progress bar container", () => {
    const { container } = render(<ReadingProgress />);
    const bar = container.firstElementChild as HTMLElement;
    expect(bar).toBeInTheDocument();
    expect(bar.className).toContain("fixed");
    expect(bar.className).toContain("top-0");
  });

  it("marks the progress bar as decorative (aria-hidden) so screen readers skip it", () => {
    const { container } = render(<ReadingProgress />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("renders an inner fill element with a left transform origin", () => {
    const { container } = render(<ReadingProgress />);
    const fill = container.querySelector(".origin-left");
    expect(fill).toBeInTheDocument();
  });

  it("renders without throwing when no scroll has occurred", () => {
    expect(() => render(<ReadingProgress />)).not.toThrow();
  });
});
