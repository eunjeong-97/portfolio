// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import Error from "./error";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("app/error", () => {
  it("renders the error heading and guidance", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(<Error error={new globalThis.Error("boom")} reset={vi.fn()} />);
    expect(screen.getByRole("heading", { name: "오류가 발생했습니다", level: 2 })).toBeInTheDocument();
    expect(screen.getByText(/페이지를 불러오는 중 문제가 발생했습니다/)).toBeInTheDocument();
  });

  it("calls reset when the '다시 시도' button is clicked", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const reset = vi.fn();
    render(<Error error={new globalThis.Error("boom")} reset={reset} />);
    fireEvent.click(screen.getByRole("button", { name: /다시 시도/ }));
    expect(reset).toHaveBeenCalledOnce();
  });

  it("logs the error to the console on mount", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const err = new globalThis.Error("boom");
    render(<Error error={err} reset={vi.fn()} />);
    expect(errorSpy).toHaveBeenCalledWith(err);
  });
});
