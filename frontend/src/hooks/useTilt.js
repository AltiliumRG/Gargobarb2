import { useEffect, useRef } from "react";

export const useTilt = () => {
  const ref = useRef();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e) => {
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const rotateX = -(y / rect.height - 0.5) * 25;
  const rotateY = (x / rect.width - 0.5) * 25;

  el.style.transform = `
    perspective(1200px)
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
    scale(1.05)
  `;

  // 🔥 luz dinámica con el cursor
  el.style.background = `
    radial-gradient(circle at ${x}px ${y}px,
    rgba(250,204,21,0.15),
    transparent 40%)
  `;
};

    const reset = () => {
      el.style.transform = `
        perspective(1000px)
        rotateX(0deg)
        rotateY(0deg)
        scale(1)
      `;
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", reset);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", reset);
    };
  }, []);

  return ref;
};