"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useScroll } from "framer-motion";

const PRO_CONFIG = {
  particlesCount: 12000,
  arms: 4,
  radius: 8,
  spin: 1.2,
  randomness: 0.25,
  randomnessPower: 3.5,
  insideColor: "#00F2FF",
  outsideColor: "#050015",
  coreColor: "#00F2FF",
};

// --- Core Event Horizon Component ---
const EventHorizon = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const shader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(PRO_CONFIG.coreColor) },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform float uTime;
      uniform vec3 uColor;
      
      void main() {
        float fresnel = pow(1.5 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
        float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
        
        vec3 color = mix(vec3(0.0), uColor, fresnel);
        color += (uColor * pulse * 0.1);
        
        gl_FragColor = vec4(color, fresnel * 0.9);
      }
    `
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime();
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.8, 64, 64]} />
      <shaderMaterial args={[shader]} transparent side={THREE.DoubleSide} />
    </mesh>
  );
};

// Pure helper: all Math.random() calls live outside React render lifecycle
function generateNeuralParticleData() {
  const pos = new Float32Array(PRO_CONFIG.particlesCount * 3);
  const rand = new Float32Array(PRO_CONFIG.particlesCount * 3);
  const cols = new Float32Array(PRO_CONFIG.particlesCount * 3);
  const scs = new Float32Array(PRO_CONFIG.particlesCount);

  const cCore = new THREE.Color("#00F2FF"); // Electric Cyan (Inside Core)
  const cBlue = new THREE.Color("#0055FF"); // Cosmic Blue (Arm Inner)
  const cPurple = new THREE.Color("#7000FF"); // Nebula Purple (Arm Outer)
  const cPink = new THREE.Color("#FF007A"); // Stellar Pink (Outer Space Dust)

  for (let i = 0; i < PRO_CONFIG.particlesCount; i++) {
    const radius = Math.random() * PRO_CONFIG.radius;
    const spinAngle = radius * PRO_CONFIG.spin;
    const armAngle = ((i % PRO_CONFIG.arms) / PRO_CONFIG.arms) * Math.PI * 2;

    const rp = PRO_CONFIG.randomnessPower;
    const rs = PRO_CONFIG.randomness;
    const randomX = Math.pow(Math.random(), rp) * (Math.random() < 0.5 ? 1 : -1) * rs * radius;
    const randomY = Math.pow(Math.random(), rp) * (Math.random() < 0.5 ? 1 : -1) * rs * radius;
    const randomZ = Math.pow(Math.random(), rp) * (Math.random() < 0.5 ? 1 : -1) * rs * radius;

    pos[i * 3] = Math.cos(armAngle + spinAngle) * radius;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 0.55; // Slightly deeper particle spread
    pos[i * 3 + 2] = Math.sin(armAngle + spinAngle) * radius;

    rand[i * 3] = randomX;
    rand[i * 3 + 1] = randomY;
    rand[i * 3 + 2] = randomZ;

    // Advanced 4-Color Gradient Nebula Interpolation
    const t = radius / PRO_CONFIG.radius;
    let mixedColor = cCore.clone();
    
    if (t < 0.22) {
      mixedColor.lerp(cBlue, t * 4.54);
    } else if (t < 0.55) {
      mixedColor = cBlue.clone().lerp(cPurple, (t - 0.22) * 3.03);
    } else {
      mixedColor = cPurple.clone().lerp(cPink, (t - 0.55) * 2.22);
    }

    cols[i * 3] = mixedColor.r;
    cols[i * 3 + 1] = mixedColor.g;
    cols[i * 3 + 2] = mixedColor.b;

    scs[i] = Math.random();
  }

  return [pos, rand, cols, scs] as const;
}

// --- Particles with Cursor Gravity ---
const NeuralParticles = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse, viewport } = useThree();

  const [positions, randomness, colors, scales] = useMemo(() => generateNeuralParticleData(), []);

  const shader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: 40.0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uGravity: { value: 0.0 }
    },
    vertexShader: `
      uniform float uTime;
      uniform float uSize;
      uniform vec2 uMouse;
      uniform float uGravity;
      attribute float aScale;
      attribute vec3 aRandomness;
      varying vec3 vColor;
      
      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        
        // Basic Spin
        float angle = atan(modelPosition.x, modelPosition.z);
        float distanceToCenter = length(modelPosition.xz);
        float angleOffset = (1.0 / distanceToCenter) * uTime * 0.15;
        angle += angleOffset;
        
        modelPosition.x = cos(angle) * distanceToCenter;
        modelPosition.z = sin(angle) * distanceToCenter;

        // Randomness
        modelPosition.xyz += aRandomness;

        // CURSOR GRAVITY: Particles "lean" toward the mouse
        vec3 mouseWorld = vec3(uMouse.x * 10.0, uMouse.y * 10.0, 0.0);
        float distToMouse = distance(modelPosition.xyz, mouseWorld);
        float pull = (1.0 / (distToMouse + 1.0)) * uGravity * 2.0;
        modelPosition.xyz = mix(modelPosition.xyz, mouseWorld, pull);

        // Pulse
        float pulse = sin(uTime * 2.5 + distanceToCenter) * 0.08;
        modelPosition.y += pulse;

        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectionPosition = projectionMatrix * viewPosition;
        gl_Position = projectionPosition;

        gl_PointSize = uSize * aScale;
        gl_PointSize *= (1.0 / - viewPosition.z);
        
        vColor = color;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        float strength = distance(gl_PointCoord, vec2(0.5));
        strength = 1.0 - strength;
        strength = pow(strength, 8.0);
        
        vec3 finalColor = mix(vec3(0.0), vColor, strength);
        gl_FragColor = vec4(finalColor, strength);
      }
    `
  }), []);

  useFrame((state) => {
    if (pointsRef.current) {
      const material = pointsRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime();
      material.uniforms.uMouse.value.set(mouse.x * (viewport.width / 2), mouse.y * (viewport.height / 2));
      material.uniforms.uGravity.value = 0.5; // Active gravity
      
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aRandomness" args={[randomness, 3]} />
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

const CameraController = () => {
  const { scrollYProgress } = useScroll();
  const scrollRef = useRef(0);
  
  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      scrollRef.current = latest;
    });
  }, [scrollYProgress]);
  
  useFrame((state) => {
    const scroll = scrollRef.current;
    
    // Flight path configuration
    let targetX = 0;
    let targetY = 6;
    let targetZ = 12;
    
    if (scroll < 0.25) {
      // Transition from Hero to Problem: Zoom deep into the core event horizon
      const t = scroll / 0.25;
      targetX = THREE.MathUtils.lerp(0, 0, t);
      targetY = THREE.MathUtils.lerp(6, 1.5, t);
      targetZ = THREE.MathUtils.lerp(12, 4.5, t);
    } else if (scroll < 0.5) {
      // Transition from Problem to Services: Tilt and dynamic pan
      const t = (scroll - 0.25) / 0.25;
      targetX = THREE.MathUtils.lerp(0, 8, t);
      targetY = THREE.MathUtils.lerp(1.5, 2, t);
      targetZ = THREE.MathUtils.lerp(4.5, 7.5, t);
    } else if (scroll < 0.75) {
      // Transition from Services to Architecture/ROI: Low-angle galactic flight path
      const t = (scroll - 0.5) / 0.25;
      targetX = THREE.MathUtils.lerp(8, -7, t);
      targetY = THREE.MathUtils.lerp(2, -3, t);
      targetZ = THREE.MathUtils.lerp(7.5, 8, t);
    } else {
      // Transition from Architecture/ROI to Contact/About: Wider HUD view
      const t = (scroll - 0.75) / 0.25;
      targetX = THREE.MathUtils.lerp(-7, 0, t);
      targetY = THREE.MathUtils.lerp(-3, 8, t);
      targetZ = THREE.MathUtils.lerp(8, 14, t);
    }
    
    // Smooth interpolation with high performance lerp
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
    
    // Keep camera focused on the Event Horizon center core
    state.camera.lookAt(0, 0, 0);
  });
  
  return null;
};

export default function NeuralGalaxyPro() {
  return (
    <div style={{ width: "100%", height: "100vh", background: "transparent", overflow: "hidden", position: "relative" }}>
      <Canvas camera={{ position: [0, 6, 12], fov: 40 }} dpr={[1, 2]}>
        <ambientLight intensity={0.2} />
        
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
          <NeuralParticles />
          <EventHorizon />
        </Float>
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <CameraController />
      </Canvas>
      
      {/* Cinematic Overlays */}
      <div style={{ 
        position: "absolute", 
        inset: 0, 
        pointerEvents: "none", 
        background: "radial-gradient(circle at center, transparent 0%, rgba(2,2,2,0.4) 100%)",
        zIndex: 2
      }} />
      
      <div style={{ 
        position: "absolute", 
        inset: 0, 
        pointerEvents: "none", 
        background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 2px)",
        opacity: 0.4,
        zIndex: 3
      }} />
    </div>
  );
}
