"use client";

import { motion } from "framer-motion";

const KEYWORDS = [
  "INVENTORY-INTELLIGENCE",
  "//",
  "MARGIN-PRESERVATION",
  "//",
  "DIRECT-COMMERCE",
  "//",
  "LTV-RETENTION-ENGINE",
  "//",
  "CAPITAL-RECOVERY",
  "//",
  "DATA-OWNERSHIP",
  "//",
  "OMNICHANNEL-OPS",
  "//",
  "VIP-CLIENTELING",
  "//",
];

export const NeuralMarquee = () => {
  return (
    <div className="w-full py-5 border-y border-[rgba(10,10,12,0.08)] overflow-hidden relative z-20 bg-[var(--bg-color)]">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--bg-color)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--bg-color)] to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex items-center gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {/* Duplicate for seamless loop */}
        {[...Array(2)].map((_, dupIdx) => (
          <div key={dupIdx} className="flex items-center gap-12">
            {KEYWORDS.map((kw, i) =>
              kw === "//" ? (
                <span
                  key={`${dupIdx}-${i}`}
                  className="text-[var(--electric-cyan)] opacity-30 font-[var(--font-geist-mono)] text-xs"
                  aria-hidden="true"
                >{"//"}</span>
              ) : (
                <span
                  key={`${dupIdx}-${i}`}
                  className="editorial-tag opacity-50 hover:opacity-100 transition-opacity duration-300"
                  style={{ fontSize: "9px" }}
                >
                  {kw}
                </span>
              )
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
};
