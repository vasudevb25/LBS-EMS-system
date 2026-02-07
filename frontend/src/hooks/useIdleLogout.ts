import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const IDLE_TIME = 15 * 60 * 1000; // 15 minutes

export default function useIdleLogout() {
  const navigate = useNavigate();
  const timer = useRef<number | null>(null);

  const resetTimer = () => {
    if (timer.current) window.clearTimeout(timer.current);

    timer.current = window.setTimeout(() => {
      localStorage.clear();
      navigate("/login", { replace: true });
    }, IDLE_TIME);
  };

  useEffect(() => {
    const events = [
      "mousemove",
      "keydown",
      "mousedown",
      "touchstart",
      "scroll",
    ];

    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer(); // start timer immediately

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);
}
