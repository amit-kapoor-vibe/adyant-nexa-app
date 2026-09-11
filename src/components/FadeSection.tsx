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
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -20px 0px", amount: "some" }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        delay: delay,
      }}
      className={className}
      style={{ position: "relative", zIndex: 1, ...style }}
    >
      {children}
    </motion.div>
  );
};
