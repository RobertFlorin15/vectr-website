import * as THREE from 'three';
import type { TierConfig } from '../../lib/tier';

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Rețeaua de puncte de bază p₀, centrată în O, cu jitter determinist de ±0.06·s. Nu se desenează. */
export function createLattice({ nx, ny, nz, step }: TierConfig) {
  const base = new Float32Array(nx * ny * nz * 3);
  const rnd = mulberry32(112236397);
  const j = 0.06 * step;
  let o = 0;
  for (let k = 0; k < nz; k++) {
    const z = nz === 1 ? 0 : -1 + (2 * k) / (nz - 1);
    for (let y = 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) {
        base[o++] = (x - (nx - 1) / 2) * step + (rnd() * 2 - 1) * j;
        base[o++] = (y - (ny - 1) / 2) * step + (rnd() * 2 - 1) * j;
        base[o++] = z + (rnd() * 2 - 1) * j;
      }
    }
  }
  return { attribute: new THREE.InstancedBufferAttribute(base, 3), count: nx * ny * nz };
}
