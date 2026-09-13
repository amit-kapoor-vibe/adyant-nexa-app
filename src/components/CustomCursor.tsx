"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  // useRef instead of useState to avoid setState-in-effect lint error
  const mountedRef = useRef(false);

  // Ultra-precise MotionValues
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Super-tight spring for "Instant" feeling (Pro-grade)
  const springConfig = { damping: 50, stiffness: 1000, mass: 0.05 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (window.innerWidth < 768) return;
    mountedRef.current = true;
    
    const updatePos = (e: MouseEvent) => {
      // Show cursor as soon as it moves
      if (!isVisible) setIsVisible(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setIsHovering(!!(t.tagName === "A" || t.tagName === "BUTTON" || t.closest("a") || t.closest("button") || t.style.cursor === "pointer"));
    };

    window.addEventListener("mousemove", updatePos);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handleOver);
    
    return () => {
      window.removeEventListener("mousemove", updatePos);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleOver);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!mountedRef.current) return null;

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHovering ? 50 : 24,
          height: isHovering ? 50 : 24,
          borderRadius: "50%",
          border: "1.5px solid #00F2FF",
          background: isHovering ? "rgba(0, 242, 255, 0.1)" : "transparent",
          boxShadow: isHovering ? "0 0 15px rgba(0, 242, 255, 0.4)" : "none",
          opacity: isVisible ? 1 : 0,
          pointerEvents: "none",
          zIndex: 2147483647,
          mixBlendMode: "screen",
          transition: "width 0.25s, height 0.25s, opacity 0.3s",
        }}
      />
      {/* Inner Dot for Precision */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: mouseX, // No spring on the center dot for "zero-latency" feel
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: "#00F2FF",
          boxShadow: "0 0 10px #00F2FF",
          opacity: isVisible ? 1 : 0,
          pointerEvents: "none",
          zIndex: 2147483647,
          transition: "opacity 0.3s",
        }}
      />
    </>
  );
};
