"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

const SINGLE_THREAD_POINTS = 160;
const STARDUST_COUNT = 140;

// Authentic Astrophysical Black Hole Plasma Palette
const PALETTE = {
  whiteGold: "#FFD700",
  plasmaOrange: "#FF5500",
  goldenAmber: "#FF9900",
};

// --- Single Luminous Hero Silk Thread (FINAL LOCK: Infinite Span, No Shape Change, No 360 Rotation) ---
const SingleLuminousHeroThread = () => {
  const lineRef = useRef<THREE.Line>(null);
  const { mouse } = useThree();

  // Base Silk Curve Coordinates (Spans horizontally across viewport)
  const basePoints = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let j = 0; j < SINGLE_THREAD_POINTS; j++) {
      const t = j / (SINGLE_THREAD_POINTS - 1);
      const x = (t - 0.5) * 48; // Spans across full viewport width
      const y = Math.sin(t * Math.PI * 3.5) * 2.0;
      const z = Math.cos(t * Math.PI * 2.5) * 1.5;
      pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(SINGLE_THREAD_POINTS * 3);
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (lineRef.current) {
      const t = state.clock.getElapsedTime();
      const posAttr = lineRef.current.geometry.attributes.position as THREE.BufferAttribute;

      const mouseWorld = new THREE.Vector3(mouse.x * 8.0, mouse.y * 6.0, 0);

      for (let j = 0; j < SINGLE_THREAD_POINTS; j++) {
        const bP = basePoints[j];

        // Smooth organic silk wave pulse (constant, elegant, non-changing shape)
        const waveY = Math.sin(t * 1.3 + j * 0.06) * 0.35;
        const waveZ = Math.cos(t * 1.0 + j * 0.05) * 0.25;

        const currentPt = new THREE.Vector3(bP.x, bP.y + waveY, bP.z + waveZ);

        // Elastic Mouse Cursor Tension Magnetism
        const distToMouse = currentPt.distanceTo(mouseWorld);
        const magnetPull = (1.0 / (distToMouse + 1.2)) * 0.45;
        currentPt.lerp(mouseWorld, magnetPull);

        posAttr.setXYZ(j, currentPt.x, currentPt.y, currentPt.z);
      }

      posAttr.needsUpdate = true;

      // Mouse Parallax Float (NO 360-degree rotation)
      lineRef.current.position.x = THREE.MathUtils.lerp(lineRef.current.position.x, mouse.x * 0.4, 0.05);
      lineRef.current.position.y = THREE.MathUtils.lerp(lineRef.current.position.y, mouse.y * 0.3, 0.05);
    }
  });

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color={PALETTE.whiteGold} transparent opacity={0.85} linewidth={1.5} blending={THREE.AdditiveBlending} />
    </line>
  );
};

// --- Accretion Plasma Stardust Stream (Golden Amber & Fiery Orange) ---
function generatePlasmaStardustData() {
  const pos = new Float32Array(STARDUST_COUNT * 3);
  const cols = new Float32Array(STARDUST_COUNT * 3);
  const scs = new Float32Array(STARDUST_COUNT);

  const hotColor = new THREE.Color(PALETTE.whiteGold);
  const plasmaColor = new THREE.Color(PALETTE.plasmaOrange);

  for (let i = 0; i < STARDUST_COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 20;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 1;

    const col = Math.random() < 0.65 ? hotColor : plasmaColor;
    cols[i * 3] = col.r;
    cols[i * 3 + 1] = col.g;
    cols[i * 3 + 2] = col.b;

    scs[i] = 1.0 + Math.random() * 1.8;
  }

  return [pos, cols, scs] as const;
}

const PlasmaStardustStream = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const [positions, colors, scales] = useMemo(() => generatePlasmaStardustData(), []);

  const shader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: 52.0 },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uSize;
      attribute float aScale;
      varying vec3 vColor;

      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        
        modelPosition.y += mod(uTime * 0.42 + position.x * 2.5, 14.0) - 7.0;
        modelPosition.x += sin(uTime * 0.5 + position.y * 0.5) * 0.22;

        vec4 viewPosition = viewMatrix * modelPosition;
        gl_Position = projectionMatrix * viewPosition;

        gl_PointSize = uSize * aScale * (1.0 / - viewPosition.z);
        vColor = color;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        float dist = distance(gl_PointCoord, vec2(0.5));
        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
        alpha = pow(alpha, 2.5);

        gl_FragColor = vec4(vColor, alpha * 0.85);
      }
    `
  }), []);

  useFrame((state) => {
    if (pointsRef.current) {
      const mat = pointsRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = state.clock.getElapsedTime();
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
      </bufferGeometry>
      <shaderMaterial
        args={[shader]}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </points>
  );
};

export default function GlobalBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundColor: "#000000" }}>
      <Canvas camera={{ position: [0, 0, 8.5], fov: 42 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <Stars radius={50} depth={50} count={2800} factor={4} saturation={0} fade speed={1} />
        <Float speed={1.1} rotationIntensity={0.06} floatIntensity={0.06}>
          <SingleLuminousHeroThread />
          <PlasmaStardustStream />
        </Float>
      </Canvas>

      {/* Volumetric Plasma Gold / Orange Ambient Glow Orbs */}
      <div 
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 215, 0, 0.12) 0%, rgba(255, 69, 0, 0.04) 55%, transparent 75%)",
          filter: "blur(85px)",
          pointerEvents: "none",
        }}
      />

      {/* Subtle HUD Grid Overlay */}
      <div className="hud-grid" style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.12 }} />

      {/* Radial Soft Vignette Shadow for High Foreground Text Contrast */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "radial-gradient(circle at center, transparent 25%, rgba(0,0,0,0.92) 100%)",
        }}
      />
    </div>
  );
}
