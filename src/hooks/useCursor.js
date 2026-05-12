import { useEffect, useState } from "react";

export function useCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // detect desktop pointer device
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia("(pointer: fine)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    const handleChange = (e) => {
      setIsDesktop(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const move = (e) => setPos({ x: e.clientX, y: e.clientY });

    const down = () => setIsClicking(true);
    const up = () => setIsClicking(false);

    const checkTarget = (e) => {
      const el = e.target;

      const isInteractive = el.closest(
        'button, a, [role="button"], input, select, textarea',
      );

      setIsPointer(!!isInteractive);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousemove", checkTarget);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousemove", checkTarget);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [isDesktop]);

  return {
    pos,
    isPointer,
    isClicking,
    isDesktop,
  };
}
