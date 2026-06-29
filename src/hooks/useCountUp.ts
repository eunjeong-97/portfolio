import { useState, useEffect } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function useCountUp(target: number, isActive: boolean, duration = 1200): number {
  const reducedMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive || reducedMotion) return;
    let startTime: number | null = null;
    let rafId: number;
    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [isActive, target, duration, reducedMotion]);

  return reducedMotion && isActive ? target : count;
}
