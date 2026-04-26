"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  opacity: number;
  speed: number;
}

/** Animated neural network canvas — purely visual, no interaction. */
export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);

  useEffect(() => {
    nodesRef.current = Array.from({ length: 16 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      targetX: Math.random() * 100,
      targetY: Math.random() * 100,
      size: Math.random() * 1.5 + 1,
      opacity: Math.random() * 0.3 + 0.1,
      speed: 0.0003 + Math.random() * 0.0007,
    }));

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      nodesRef.current.forEach((n) => {
        n.x += (n.targetX - n.x) * n.speed;
        n.y += (n.targetY - n.y) * n.speed;

        if (Math.abs(n.x - n.targetX) < 1) {
          n.targetX = Math.random() * 100;
          n.targetY = Math.random() * 100;
        }

        const px = (n.x / 100) * w;
        const py = (n.y / 100) * h;

        ctx.beginPath();
        ctx.arc(px, py, n.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 242, 255, ${n.opacity})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Connecting lines
      for (let i = 0; i < nodesRef.current.length; i++) {
        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const n1 = nodesRef.current[i];
          const n2 = nodesRef.current[j];
          const dx = ((n1.x - n2.x) / 100) * w;
          const dy = ((n1.y - n2.y) / 100) * h;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo((n1.x / 100) * w, (n1.y / 100) * h);
            ctx.lineTo((n2.x / 100) * w, (n2.y / 100) * h);
            ctx.strokeStyle = `rgba(0, 242, 255, ${(1 - dist / 150) * 0.05})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.5 }}
    />
  );
}
