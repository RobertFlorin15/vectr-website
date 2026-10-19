import { useFrame, useThree } from '@react-three/fiber';
import { damp, damp3 } from 'maath/easing';
import { animate, type MotionValue } from 'motion/react';
import { useEffect, useMemo, type RefObject } from 'react';
import * as THREE from 'three';
import type { Charge } from '../../hooks/usePointerCharge';
import { evaluateField, fieldAngleDeg, type FieldGains, type PointerSample } from '../../lib/field';
import { PHONE, TIERS, type TierConfig } from '../../lib/tier';
import { ease } from '../../lib/tokens';
import { createArrowGeometry } from './arrowGeometry';
import { createLattice } from './lattice';
import { vectorFrag } from './shaders/vector.frag.glsl';
import { vectorVert } from './shaders/vector.vert.glsl';

interface Props {
  tier: keyof typeof TIERS;
  charge: RefObject<Charge>;
  scroll: MotionValue<number>;
  readout: RefObject<HTMLElement | null>;
  fieldTop: RefObject<number>;
  reduced: boolean;
  onReady: () => void;
}

const CAMERA_Z = 14;
const READOUT_INTERVAL = 1 / 15;
const EASE_OUT: [number, number, number, number] = [...ease.out];

/** Phone: subtler emblem, stronger flow and charge, wider sampling domain. */
/** Phone: the ambient flow runs faster (desktop: 1). */
const PHONE_TIME_SCALE = 1.4;
const PHONE_GAINS: FieldGains = { scale: 2, src: 0.75, flow: 3, ptr: 1.8 };
const DESKTOP: FieldGains = { scale: 1, src: 1, flow: 1, ptr: 1 };

const fmt = (v: number) => `${v < 0 ? '−' : '+'}${Math.abs(v).toFixed(2)}`;

export default function VectorField({ tier, charge, scroll, readout, fieldTop, reduced, onReady }: Props) {
  const size = useThree((s) => s.size);
  const cfg: TierConfig = size.width < 768 ? PHONE : TIERS[tier];
  const invalidate = useThree((s) => s.invalidate);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const mobile = size.width < 768;
  useEffect(() => () => camera.clearViewOffset(), [camera]);

  const arrow = useMemo(() => createArrowGeometry(), []);
  const geometry = useMemo(() => {
    const { attribute, count } = createLattice(cfg);
    const g = new THREE.InstancedBufferGeometry();
    g.index = arrow.index;
    g.setAttribute('position', arrow.attributes.position);
    g.setAttribute('normal', arrow.attributes.normal);
    g.setAttribute('aPart', arrow.attributes.aPart);
    g.setAttribute('aBase', attribute);
    g.instanceCount = count;
    return g;
  }, [arrow, cfg]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntro: { value: 0 },
      uPtrAmp: { value: 0 },
      uPolarity: { value: 1 },
      uPointer: { value: new THREE.Vector3() },
      uScroll: { value: 0 },
      uMaskMode: { value: 0 },
      uFieldScale: { value: 1 },
      uSrcGain: { value: 1 },
      uFlowGain: { value: 1 },
      uPtrGain: { value: 1 },
      uArrowScale: { value: 1 },
      uMaskTop: { value: 0.5 },
      uFog: { value: new THREE.Vector2(12.5, 16) },
    }),
    [],
  );
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vectorVert,
        fragmentShader: vectorFrag,
        uniforms,
        transparent: false,
        depthWrite: true,
        toneMapped: false,
      }),
    [uniforms],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => arrow.dispose(), [arrow]);
  useEffect(() => () => material.dispose(), [material]);

  // Reduced motion: render only when the charge changes.
  useEffect(() => {
    const c = charge.current;
    if (!reduced) return;
    c.onChange = invalidate;
    return () => {
      c.onChange = null;
    };
  }, [reduced, charge, invalidate]);

  // Scratch objects, created once, outside the loop.
  const scratch = useMemo(
    () => ({
      target: new THREE.Vector3(),
      field: new Float64Array(3),
      ptr: { x: 0, y: 0, z: 0, amp: 0, polarity: 1 } as PointerSample,
      ptrAmp: { v: 0 },
      time: 0,
      oy: -1,
      ow: 0,
      oh: 0,
      readoutAcc: 0,
      started: false,
      introAnim: null as { stop: () => void } | null,
    }),
    [],
  );
  useEffect(() => () => scratch.introAnim?.stop(), [scratch]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const cam = state.camera as THREE.PerspectiveCamera;
    const c = charge.current;
    if (!scratch.started) {
      scratch.started = true;
      if (reduced) {
        uniforms.uIntro.value = 1;
      } else {
        scratch.introAnim = animate(0, 1, {
          duration: mobile ? 0.6 : 1.0,
          ease: EASE_OUT,
          onUpdate: (v) => {
            uniforms.uIntro.value = v;
          },
        });
      }
      onReady();
    }

    if (!reduced) {
      scratch.time += dt * (mobile ? PHONE_TIME_SCALE : 1);
      uniforms.uTime.value = scratch.time;
    }

    // Dolly + global brightness on scroll: uniforms only, no re-render.
    const s = scroll.get();
    const dist = reduced ? CAMERA_Z : CAMERA_Z + 2 * s;
    cam.position.z = dist;
    uniforms.uScroll.value = reduced ? 0 : s;
    uniforms.uMaskMode.value = mobile ? 1 : 0;
    const gains = mobile ? PHONE_GAINS : DESKTOP;
    uniforms.uFieldScale.value = gains.scale;
    uniforms.uSrcGain.value = gains.src;
    uniforms.uFlowGain.value = gains.flow;
    uniforms.uPtrGain.value = gains.ptr;
    uniforms.uArrowScale.value = mobile ? 0.7 : 1;

    // Origin O: (78%, 55%) on desktop; on phones the centre of the area below the text. The off-axis camera anchors it there.
    const top = fieldTop.current;
    const originX = mobile ? 0.5 : 0.78;
    const originY = mobile ? 1 - (1 - top) / 2 : 0.55;
    uniforms.uMaskTop.value = top;
    if (originY !== scratch.oy || size.width !== scratch.ow || size.height !== scratch.oh) {
      scratch.oy = originY;
      scratch.ow = size.width;
      scratch.oh = size.height;
      cam.setViewOffset(size.width, size.height, -(originX - 0.5) * size.width, -(originY - 0.5) * size.height, size.width, size.height);
    }

    const vh = 2 * Math.tan((cam.fov * Math.PI) / 360) * dist;
    const vw = vh * (size.width / size.height);

    // Charge: the pointer projected onto z = 0, in lattice-local coordinates.
    scratch.target.set(((c.ndcX + 1) / 2 - originX) * vw, (originY - (1 - c.ndcY) / 2) * vh, 0);
    if (reduced) {
      uniforms.uPointer.value.copy(scratch.target);
      scratch.ptrAmp.v = c.present ? 1 : 0;
    } else {
      damp3(uniforms.uPointer.value, scratch.target, mobile ? 24 : 8, dt);
      damp(scratch.ptrAmp, 'v', c.present ? 1 : 0, mobile ? 12 : 4, dt);
    }
    uniforms.uPtrAmp.value = scratch.ptrAmp.v;
    uniforms.uPolarity.value = c.polarity;

    // Readout at ~15 Hz, written straight to the DOM.
    scratch.readoutAcc += dt;
    const el = readout.current;
    if (el && c.everPresent && (reduced || scratch.readoutAcc >= READOUT_INTERVAL)) {
      scratch.readoutAcc = 0;
      const p = uniforms.uPointer.value;
      const ptr = scratch.ptr;
      ptr.x = p.x;
      ptr.y = p.y;
      ptr.amp = 0; // the readout samples the ambient field under the charge
      evaluateField(scratch.field, p.x, p.y, 0, scratch.time, ptr, gains);
      const [fx, fy, fz] = scratch.field;
      const n = Math.hypot(fx, fy, fz);
      el.textContent = ` = (${fmt(fx)}, ${fmt(fy)}, ${fmt(fz)})   ‖v‖ = ${n.toFixed(2)}   θ = ${fieldAngleDeg(fx, fy).toFixed(1)}°`;
    }
  });

  return (
    <mesh geometry={geometry} material={material} frustumCulled={false} />
  );
}
