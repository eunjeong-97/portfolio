// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import NotFound from "./not-found";

afterEach(cleanup);

describe("app/not-found", () => {
  it("renders the 404 heading", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { name: "페이지를 찾을 수 없습니다", level: 1 })).toBeInTheDocument();
  });

  it("renders a link back to the home page", () => {
    render(<NotFound />);
    const home = screen.getByRole("link", { name: /홈으로 돌아가기/ });
    expect(home).toHaveAttribute("href", "/");
  });

  it("renders inside a main landmark", () => {
    render(<NotFound />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("shows the helpful not-found guidance message", () => {
    render(<NotFound />);
    expect(screen.getByText(/찾고 계신 페이지가 존재하지 않거나 이동된 것 같습니다/)).toBeInTheDocument();
  });
});
