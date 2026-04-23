"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface FadeSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}

export const FadeSection = ({ children, className = "", delay = 0, style }: FadeSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{
        type: "spring",
        stiffness: 120, // Increased for snappier feel
        damping: 20,    // Balanced for premium smoothness
        delay: delay,
      }}
      className={className}
      style={{ ...style }}
    >
      {children}
    </motion.div>
  );
};
