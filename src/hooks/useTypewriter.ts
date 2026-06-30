import { useState, useEffect } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function useTypewriter(
  words: string[],
  speed = 90,
  pause = 2000
): { displayed: string; completedWord: string } {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [completedWord, setCompletedWord] = useState("");

  useEffect(() => {
    if (reducedMotion) return;
    const current = words[index % words.length];
    let timeout: ReturnType<typeof setTimeout>;
    if (!isDeleting) {
      if (displayed.length < current.length) {
        timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), speed);
      } else {
        timeout = setTimeout(() => { setCompletedWord(current); setIsDeleting(true); }, pause);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), speed / 2);
      } else {
        timeout = setTimeout(() => { setIsDeleting(false); setIndex((prev) => (prev + 1) % words.length); }, 0);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, index, words, speed, pause, reducedMotion]);

  if (reducedMotion) {
    return { displayed: words[0], completedWord: words[0] };
  }
  return { displayed, completedWord };
}
