import { useCallback, useRef, useState } from "react";
import { animate, useMotionValue } from "framer-motion";

export function useHoverReveal(delayMs = 1000, enabled = true) {
  const [revealed, setRevealed] = useState(false);
  const [hovering, setHovering] = useState(false);
  const progress = useMotionValue(0);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);

  const clearReveal = useCallback(() => {
    animationRef.current?.stop();
    progress.set(0);
    setHovering(false);
    setRevealed(false);
  }, [progress]);

  const startHover = useCallback(() => {
    if (!enabled) return;
    setHovering(true);
    animationRef.current?.stop();
    animationRef.current = animate(progress, 1, {
      duration: delayMs / 1000,
      ease: "linear",
      onComplete: () => setRevealed(true),
    });
  }, [delayMs, enabled, progress]);

  return {
    revealed,
    hovering,
    progress,
    startHover,
    clearReveal,
  };
}
