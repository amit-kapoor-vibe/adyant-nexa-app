"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

const GALAXY_CONFIG = {
  particlesCount: 4000,
  arms: 3,
  radius: 5,
  spin: 1.5,
  randomness: 0.3,
  randomnessPower: 3,
  insideColor: "#00F2FF", // Electric Cyan
  outsideColor: "#0a0022", // Deep Space
};

const GalaxyParticles = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const [positions, randomness, colors, scales] = useMemo(() => {
    const pos = new Float32Array(GALAXY_CONFIG.particlesCount * 3);
    const rand = new Float32Array(GALAXY_CONFIG.particlesCount * 3);
    const cols = new Float32Array(GALAXY_CONFIG.particlesCount * 3);
    const scs = new Float32Array(GALAXY_CONFIG.particlesCount);

    const insideColor = new THREE.Color(GALAXY_CONFIG.insideColor);
    const outsideColor = new THREE.Color(GALAXY_CONFIG.outsideColor);

    for (let i = 0; i < GALAXY_CONFIG.particlesCount; i++) {
      const radius = Math.random() * GALAXY_CONFIG.radius;
      const spinAngle = radius * GALAXY_CONFIG.spin;
      const armAngle = ((i % GALAXY_CONFIG.arms) / GALAXY_CONFIG.arms) * Math.PI * 2;

      const randomX = Math.pow(Math.random(), GALAXY_CONFIG.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * GALAXY_CONFIG.randomness * radius;
      const randomY = Math.pow(Math.random(), GALAXY_CONFIG.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * GALAXY_CONFIG.randomness * radius;
      const randomZ = Math.pow(Math.random(), GALAXY_CONFIG.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * GALAXY_CONFIG.randomness * radius;

      pos[i * 3] = Math.cos(armAngle + spinAngle) * radius;
      pos[i * 3 + 1] = 0; // Will be animated or offset
      pos[i * 3 + 2] = Math.sin(armAngle + spinAngle) * radius;

      rand[i * 3] = randomX;
      rand[i * 3 + 1] = randomY;
      rand[i * 3 + 2] = randomZ;

      // Colors
      const mixedColor = insideColor.clone();
      mixedColor.lerp(outsideColor, radius / GALAXY_CONFIG.radius);
      
      cols[i * 3] = mixedColor.r;
      cols[i * 3 + 1] = mixedColor.g;
      cols[i * 3 + 2] = mixedColor.b;

      scs[i] = Math.random();
    }

    return [pos, rand, cols, scs];
  }, []);

  const particleShader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: 25.0 },
      uHeartbeat: { value: 1.0 }
    },
    vertexShader: `
      uniform float uTime;
      uniform float uSize;
      uniform float uHeartbeat;
      attribute float aScale;
      attribute vec3 aRandomness;
      varying vec3 vColor;
      
      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        
        // Spin
        float angle = atan(modelPosition.x, modelPosition.z);
        float distanceToCenter = length(modelPosition.xz);
        float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
        angle += angleOffset;
        
        modelPosition.x = cos(angle) * distanceToCenter;
        modelPosition.z = sin(angle) * distanceToCenter;

        // Add randomness
        modelPosition.xyz += aRandomness;

        // Pulse
        float pulse = sin(uTime * 2.0 + distanceToCenter * 2.0) * 0.1 * uHeartbeat;
        modelPosition.y += pulse;

        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectionPosition = projectionMatrix * viewPosition;
        gl_Position = projectionPosition;

        // Size
        gl_PointSize = uSize * aScale * uHeartbeat;
        gl_PointSize *= (1.0 / - viewPosition.z);
        
        vColor = color;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        float strength = distance(gl_PointCoord, vec2(0.5));
        strength = 1.0 - strength;
        strength = pow(strength, 10.0);
        
        vec3 finalColor = mix(vec3(0.0), vColor, strength);
        gl_FragColor = vec4(finalColor, strength);
      }
    `
  }), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      const material = pointsRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = time;
      // Heartbeat pulse calculation
      const pulse = Math.sin(time * 3.0) * 0.2 + 1.0;
      material.uniforms.uHeartbeat.value = pulse;
      
      pointsRef.current.rotation.y = time * 0.05;
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
        args={[particleShader]}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </points>
  );
};

const NeuralShankh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const shaderRef = useRef<any>(null);

  const shankhShader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#00F2FF") },
      uHeartbeat: { value: 1.0 }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform float uTime;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        
        vec3 pos = position;
        // Twist & Pulse
        float angle = pos.y * 2.0 + uTime;
        float s = sin(angle);
        float c = cos(angle);
        pos.xz *= mat2(c, -s, s, c);
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uHeartbeat;
      
      void main() {
        float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        float pulse = sin(uTime * 3.0) * 0.5 + 0.5;
        
        vec3 color = mix(uColor, vec3(1.0), fresnel * 0.5);
        color *= (0.8 + pulse * 0.2 * uHeartbeat);
        
        gl_FragColor = vec4(color, 0.8 * fresnel);
      }
    `
  }), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = time;
      material.uniforms.uHeartbeat.value = Math.sin(time * 3.0) * 0.2 + 1.0;
      meshRef.current.rotation.y = time * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1.2, 0.3, 200, 32]} />
      <shaderMaterial args={[shankhShader]} transparent side={THREE.DoubleSide} />
    </mesh>
  );
};

export default function ThreeSwirl() {
  return (
    <div style={{ width: "100%", height: "500px", background: "transparent", overflow: "hidden", position: "relative" }}>
      <Canvas camera={{ position: [0, 4, 8], fov: 45 }}>
        <color attach="background" args={["#020202"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00F2FF" />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <GalaxyParticles />
          <NeuralShankh />
        </Float>
        
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
      
      {/* Decorative Scanline Overlay for cinematic feel */}
      <div style={{ 
        position: "absolute", 
        inset: 0, 
        pointerEvents: "none", 
        background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 2px)",
        opacity: 0.3 
      }} />
    </div>
  );
}

