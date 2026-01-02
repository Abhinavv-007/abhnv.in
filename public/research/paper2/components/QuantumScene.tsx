/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial, Line, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Fix for JSX Intrinsic Elements by using variable components
const Group = 'group' as any;
const Fog = 'fog' as any;
const AmbientLight = 'ambientLight' as any;

// Adjusted props interface
interface SceneProps {
  activeTheme: 'amber' | 'red' | 'blue' | 'emerald';
  darkMode: boolean;
}

// ... existing code ...

const THEME_COLORS = {
  amber: "#f59e0b", // Energy/Watts
  red: "#ef4444",   // Heat/Danger
  blue: "#3b82f6",  // Compute/Cold
  emerald: "#10b981", // Solution/Green
  stone: "#78716c", // Fallback/Stone
};

const EnergySparks = ({ activeTheme }: { activeTheme: keyof typeof THEME_COLORS }) => {
  const ref = useRef<THREE.Points>(null);
  const count = 2000;

  // Initialize positions
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Create a cylindrical distribution (like a server rack or flow)
      const r = Math.random() * 8 + 2;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 20;

      pos[i * 3] = r * Math.cos(theta);
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = r * Math.sin(theta);
    }
    return pos;
  }, [count]);

  const targetColor = new THREE.Color(THEME_COLORS[activeTheme] || THEME_COLORS.amber);
  const currentColor = useRef(new THREE.Color(THEME_COLORS.amber));

  useFrame((state, delta) => {
    if (ref.current) {
      // Spiral rotation
      ref.current.rotation.y += delta * 0.1;

      // Color interpolation
      currentColor.current.lerp(targetColor, delta * 2);
      (ref.current.material as THREE.PointsMaterial).color = currentColor.current;

      // Jitter effect for "electricity" feel
      ref.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={THEME_COLORS.amber}
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const FloatingOrbs = ({ activeTheme, darkMode }: { activeTheme: keyof typeof THEME_COLORS, darkMode: boolean }) => {
  const count = 20; // Increased count
  const orbs = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Create scattered orb positions
      const x = (Math.random() - 0.5) * 30; // Wider spread
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 10 - 2;

      // Varied usage: Mostly small, some medium-large
      const isLarge = Math.random() > 0.8;
      const scale = isLarge
        ? Math.random() * 0.4 + 0.2 // Big ones (0.2 - 0.6)
        : Math.random() * 0.15 + 0.05; // Small ones

      temp.push({ position: [x, y, z] as [number, number, number], scale });
    }
    return temp;
  }, []);

  const color = THEME_COLORS[activeTheme];

  return (
    <Group>
      {orbs.map((orb, i) => (
        <Float key={i} speed={2 + Math.random() * 2} rotationIntensity={0.2} floatIntensity={1}>
          <mesh position={orb.position} scale={orb.scale}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={darkMode ? 0.15 : 0.3} // More visible in light mode
            />
          </mesh>
        </Float>
      ))}
    </Group>
  )
}

export const GlobalBackground: React.FC<SceneProps> = ({ activeTheme, darkMode }) => {
  return (
    <div className={`fixed inset-0 z-0 pointer-events-none transition-colors duration-1000 ${darkMode ? 'bg-stone-900' : 'bg-[#e7e5e4]'}`}>
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
        <Fog attach="fog" args={[darkMode ? '#0c0a09' : '#e7e5e4', 5, 30]} />
        <AmbientLight intensity={darkMode ? 0.2 : 0.5} />
        <EnergySparks activeTheme={activeTheme} />
        <FloatingOrbs activeTheme={activeTheme} darkMode={darkMode} />
        <Environment preset="city" />
      </Canvas>
      <div className={`absolute inset-0 bg-gradient-to-t ${darkMode ? 'from-stone-950 via-transparent to-stone-950/50' : 'from-stone-200 via-transparent to-stone-200/50'}`} />
    </div>
  );
};

// Legacy Exports
export const HeroScene = GlobalBackground;
export const QuantumComputerScene = GlobalBackground;