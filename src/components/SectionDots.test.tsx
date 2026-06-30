// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

vi.mock("@/utils/scrollTo", () => ({ scrollToId: vi.fn() }));
const useActiveSectionMock = vi.fn();
vi.mock("@/hooks/useActiveSection", () => ({
  useActiveSection: (ids: string[]) => useActiveSectionMock(ids),
}));

import SectionDots from "./SectionDots";
import { scrollToId } from "@/utils/scrollTo";

const SECTION_LABELS = ["Projects", "About", "Skills", "Experience", "GitHub", "Blog", "Contact"];

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("SectionDots", () => {
  it("renders a navigation landmark labelled '섹션 탐색'", () => {
    useActiveSectionMock.mockReturnValue("");
    render(<SectionDots />);
    expect(screen.getByRole("navigation", { name: "섹션 탐색" })).toBeInTheDocument();
  });

  it("renders one button per section with a '...섹션으로 이동' aria-label", () => {
    useActiveSectionMock.mockReturnValue("");
    render(<SectionDots />);
    for (const label of SECTION_LABELS) {
      expect(screen.getByRole("button", { name: `${label} 섹션으로 이동` })).toBeInTheDocument();
    }
    expect(screen.getAllByRole("button")).toHaveLength(SECTION_LABELS.length);
  });

  it("calls scrollToId with the section id when a dot is clicked", () => {
    useActiveSectionMock.mockReturnValue("");
    render(<SectionDots />);
    fireEvent.click(screen.getByRole("button", { name: "Skills 섹션으로 이동" }));
    expect(scrollToId).toHaveBeenCalledWith("skills");
  });

  it("marks the active section's button with aria-current='location'", () => {
    useActiveSectionMock.mockReturnValue("experience");
    render(<SectionDots />);
    const activeBtn = screen.getByRole("button", { name: "Experience 섹션으로 이동" });
    expect(activeBtn).toHaveAttribute("aria-current", "location");
  });

  it("does not set aria-current on non-active section buttons", () => {
    useActiveSectionMock.mockReturnValue("experience");
    render(<SectionDots />);
    const inactiveBtn = screen.getByRole("button", { name: "Projects 섹션으로 이동" });
    expect(inactiveBtn).not.toHaveAttribute("aria-current");
  });

  it("passes all seven section ids to useActiveSection", () => {
    useActiveSectionMock.mockReturnValue("");
    render(<SectionDots />);
    expect(useActiveSectionMock).toHaveBeenCalledWith([
      "projects",
      "about",
      "skills",
      "experience",
      "github",
      "blog",
      "contact",
    ]);
  });
});
