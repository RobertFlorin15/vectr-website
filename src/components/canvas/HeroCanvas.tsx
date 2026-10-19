import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import type { MotionValue } from 'motion/react';
import { useCallback, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import type { Charge } from '../../hooks/usePointerCharge';
import { TIER_ORDER, TIERS, detectTier, type Tier } from '../../lib/tier';
import VectorField from './VectorField';

interface Props {
  charge: RefObject<Charge>;
  scroll: MotionValue<number>;
  readout: RefObject<HTMLElement | null>;
  /** Phone: fraction of the hero height where the text ends and the field begins. */
  fieldTop: RefObject<number>;
  /** false when the hero is outside the viewport or the tab is hidden. */
  active: boolean;
  reduced: boolean;
  onReady: () => void;
  onFail: () => void;
}

type ActiveTier = Exclude<Tier, 'fallback'>;

export default function HeroCanvas({ charge, scroll, readout, fieldTop, active, reduced, onReady, onFail }: Props) {
  const initial = useRef<ActiveTier>(null as unknown as ActiveTier);
  if (initial.current === null) {
    const t = detectTier();
    initial.current = t === 'fallback' ? 'low' : t;
  }
  const [tier, setTier] = useState<ActiveTier>(initial.current);

  // Adaptive: onDecline drops a tier, onIncline climbs back, never above the initial tier.
  const shift = useCallback((dir: 1 | -1) => {
    setTier((cur) => {
      const i = TIER_ORDER.indexOf(cur) + dir;
      const floor = TIER_ORDER.indexOf(initial.current);
      return TIER_ORDER[Math.min(TIER_ORDER.length - 1, Math.max(floor, i))];
    });
  }, []);

  const frameloop = !active ? 'never' : reduced ? 'demand' : 'always';

  return (
    <Canvas
      aria-hidden
      className="absolute! inset-0"
      style={{ touchAction: 'pan-y', pointerEvents: 'none' }}
      frameloop={frameloop}
      dpr={TIERS[tier].dpr}
      flat
      camera={{ fov: 35, position: [0, 0, 14], near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', stencil: false, depth: true }}
      onCreated={({ gl, scene }) => {
        scene.background = new THREE.Color(0x000000);
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          onFail();
        });
      }}
    >
      <PerformanceMonitor onDecline={() => shift(1)} onIncline={() => shift(-1)} />
      <VectorField tier={tier} charge={charge} scroll={scroll} readout={readout} fieldTop={fieldTop} reduced={reduced} onReady={onReady} />
    </Canvas>
  );
}
