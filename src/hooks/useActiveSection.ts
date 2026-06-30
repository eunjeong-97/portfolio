import { useState, useEffect } from "react";

export function useActiveSection(sectionIds: readonly string[]): string {
  const [activeSection, setActiveSection] = useState("");
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  // sectionIds is expected to be a module-level constant — stable reference across renders
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return activeSection;
}
