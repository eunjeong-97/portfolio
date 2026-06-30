// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import ExperienceModal from "./ExperienceModal";
import type { Experience } from "@/data/experiences";

const sample: Experience = {
  id: "test-exp",
  period: "2023.01 - 2023.06",
  title: "테스트 경험",
  description: "설명 텍스트입니다.",
  details: ["첫 번째 상세", "두 번째 상세"],
  tags: ["React", "TypeScript"],
};

const sampleWithVideo: Experience = {
  ...sample,
  id: "test-video",
  videoUrl: "https://example.com/video.mp4",
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  document.body.style.overflow = "";
});

describe("ExperienceModal", () => {
  it("renders nothing when experience is null", () => {
    render(<ExperienceModal experience={null} onClose={vi.fn()} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders a labelled modal dialog with the experience title and period", () => {
    render(<ExperienceModal experience={sample} onClose={vi.fn()} />);
    const dialog = screen.getByRole("dialog", { name: "테스트 경험" });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText("2023.01 - 2023.06")).toBeInTheDocument();
  });

  it("renders every detail item and tag", () => {
    render(<ExperienceModal experience={sample} onClose={vi.fn()} />);
    expect(screen.getByText("첫 번째 상세")).toBeInTheDocument();
    expect(screen.getByText("두 번째 상세")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    render(<ExperienceModal experience={sample} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "닫기" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = vi.fn();
    render(<ExperienceModal experience={sample} onClose={onClose} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onPrev when ArrowLeft is pressed", () => {
    const onPrev = vi.fn();
    render(<ExperienceModal experience={sample} onClose={vi.fn()} onPrev={onPrev} />);
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(onPrev).toHaveBeenCalledOnce();
  });

  it("calls onNext when ArrowRight is pressed", () => {
    const onNext = vi.fn();
    render(<ExperienceModal experience={sample} onClose={vi.fn()} onNext={onNext} />);
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(onNext).toHaveBeenCalledOnce();
  });

  it("disables the prev and next buttons when no navigation handlers are provided", () => {
    render(<ExperienceModal experience={sample} onClose={vi.fn()} />);
    expect(screen.getByRole("button", { name: "이전 경험" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "다음 경험" })).toBeDisabled();
  });

  it("renders the index/total badge when currentIndex and total are provided", () => {
    render(
      <ExperienceModal experience={sample} onClose={vi.fn()} currentIndex={2} total={5} />
    );
    expect(screen.getByText("3 / 5")).toBeInTheDocument();
  });

  it("locks body scroll while open and restores it on unmount", () => {
    const { unmount } = render(<ExperienceModal experience={sample} onClose={vi.fn()} />);
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("renders the experience video with an accessible label when a videoUrl exists", () => {
    render(<ExperienceModal experience={sampleWithVideo} onClose={vi.fn()} />);
    const video = screen.getByLabelText("테스트 경험 실행 영상");
    expect(video).toHaveAttribute("src", "https://example.com/video.mp4");
  });

  it("shows a fallback alert when the video fails to load", () => {
    render(<ExperienceModal experience={sampleWithVideo} onClose={vi.fn()} />);
    const video = screen.getByLabelText("테스트 경험 실행 영상");
    fireEvent.error(video);
    expect(screen.getByRole("alert")).toHaveTextContent("영상을 불러올 수 없습니다.");
  });

  it("calls onPrev when the prev button is clicked", () => {
    const onPrev = vi.fn();
    render(<ExperienceModal experience={sample} onClose={vi.fn()} onPrev={onPrev} />);
    fireEvent.click(screen.getByRole("button", { name: "이전 경험" }));
    expect(onPrev).toHaveBeenCalledOnce();
  });
});
