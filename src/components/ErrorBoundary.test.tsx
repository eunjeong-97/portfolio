// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function Boom(): never {
  throw new Error("boom");
}

describe("ErrorBoundary", () => {
  it("renders its children when no error is thrown", () => {
    render(
      <ErrorBoundary>
        <p>정상 콘텐츠</p>
      </ErrorBoundary>
    );
    expect(screen.getByText("정상 콘텐츠")).toBeInTheDocument();
  });

  it("renders the default fallback UI when a child throws", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );
    expect(screen.getByText("페이지를 불러오는 중 오류가 발생했습니다.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "다시 시도" })).toBeInTheDocument();
  });

  it("renders a custom fallback when provided", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary fallback={<p>커스텀 폴백</p>}>
        <Boom />
      </ErrorBoundary>
    );
    expect(screen.getByText("커스텀 폴백")).toBeInTheDocument();
    expect(screen.queryByText("페이지를 불러오는 중 오류가 발생했습니다.")).not.toBeInTheDocument();
  });

  it("logs the error via console.error in componentDidCatch", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );
    expect(errorSpy).toHaveBeenCalledWith("[ErrorBoundary]", expect.any(Error), expect.anything());
  });

  it("recovers to render children again after '다시 시도' is clicked", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    let shouldThrow = true;
    function MaybeBoom() {
      if (shouldThrow) throw new Error("boom");
      return <p>복구된 콘텐츠</p>;
    }
    render(
      <ErrorBoundary>
        <MaybeBoom />
      </ErrorBoundary>
    );
    expect(screen.getByRole("button", { name: "다시 시도" })).toBeInTheDocument();
    shouldThrow = false; // next render of the child will succeed
    fireEvent.click(screen.getByRole("button", { name: "다시 시도" }));
    expect(screen.getByText("복구된 콘텐츠")).toBeInTheDocument();
  });
});
