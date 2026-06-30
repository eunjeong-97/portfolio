// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

// Stub the heavy child components so the test focuses on ClientLayout's own structure.
vi.mock("./Navigation", () => ({ default: () => <nav data-testid="navigation" /> }));
vi.mock("./ReadingProgress", () => ({ default: () => <div data-testid="reading-progress" /> }));
vi.mock("./ChatBot", () => ({ default: () => <div data-testid="chatbot" /> }));
vi.mock("./ScrollToTop", () => ({ default: () => <div data-testid="scroll-to-top" /> }));
vi.mock("./KeyboardShortcuts", () => ({ default: () => <div data-testid="keyboard-shortcuts" /> }));
vi.mock("./SectionDots", () => ({ default: () => <div data-testid="section-dots" /> }));
vi.mock("./SocialBar", () => ({ default: () => <div data-testid="social-bar" /> }));
// next/dynamic should resolve the (mocked) modules synchronously for the test
vi.mock("next/dynamic", () => ({
  default: (loader: () => Promise<{ default: React.ComponentType }>) => {
    // Resolve eagerly is not possible synchronously; render a stable placeholder.
    // ClientLayout's own output (skip link, children, Navigation) is what we assert.
    return () => null;
  },
}));

import ClientLayout from "./ClientLayout";

afterEach(cleanup);

describe("ClientLayout", () => {
  it("renders its children", () => {
    render(
      <ClientLayout>
        <main id="main-content">페이지 콘텐츠</main>
      </ClientLayout>
    );
    expect(screen.getByText("페이지 콘텐츠")).toBeInTheDocument();
  });

  it("renders a skip-to-content link pointing at #main-content", () => {
    render(
      <ClientLayout>
        <div>child</div>
      </ClientLayout>
    );
    const skip = screen.getByRole("link", { name: "메인 콘텐츠로 이동" });
    expect(skip).toHaveAttribute("href", "#main-content");
  });

  it("renders the persistent navigation and reading progress chrome", () => {
    render(
      <ClientLayout>
        <div>child</div>
      </ClientLayout>
    );
    expect(screen.getByTestId("navigation")).toBeInTheDocument();
    expect(screen.getByTestId("reading-progress")).toBeInTheDocument();
  });

  it("places the skip link before the main content in DOM order", () => {
    render(
      <ClientLayout>
        <main id="main-content">콘텐츠</main>
      </ClientLayout>
    );
    const skip = screen.getByRole("link", { name: "메인 콘텐츠로 이동" });
    const main = screen.getByText("콘텐츠");
    // skip link should come before the main content in document order
    expect(skip.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
