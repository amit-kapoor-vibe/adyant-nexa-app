"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [isHovering, setIsHovering] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updatePos = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    const handleOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setIsHovering(!!(t.tagName === "A" || t.tagName === "BUTTON" || t.closest("a") || t.closest("button")));
    };
    window.addEventListener("mousemove", updatePos);
    window.addEventListener("mouseover", handleOver);
    return () => {
      window.removeEventListener("mousemove", updatePos);
      window.removeEventListener("mouseover", handleOver);
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      <motion.div
        animate={{ x: pos.x - (isHovering ? 20 : 6), y: pos.y - (isHovering ? 20 : 6) }}
        transition={{ type: "spring", mass: 0.01, stiffness: 2500, damping: 30 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isHovering ? 40 : 12,
          height: isHovering ? 40 : 12,
          borderRadius: "50%",
          background: isHovering ? "rgba(0,242,255,0.15)" : "#00F2FF",
          border: isHovering ? "1px solid #00F2FF" : "none",
          boxShadow: "0 0 10px rgba(0,242,255,0.6)",
          pointerEvents: "none",
          zIndex: 999999,
          mixBlendMode: "screen",
        }}
      />
    </>
  );
};
