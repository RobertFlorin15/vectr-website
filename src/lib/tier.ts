export type Tier = 'high' | 'mid' | 'low' | 'fallback';

export interface TierConfig {
  nx: number;
  ny: number;
  nz: number;
  step: number;
  dpr: [number, number];
}

export const TIERS: Record<Exclude<Tier, 'fallback'>, TierConfig> = {
  high: { nx: 36, ny: 20, nz: 5, step: 0.48, dpr: [1, 2] },
  mid: { nx: 32, ny: 18, nz: 5, step: 0.48, dpr: [1, 1.5] },
  low: { nx: 14, ny: 22, nz: 3, step: 0.52, dpr: [1, 1.25] },
};

/** Telefon: rețea mult mai deasă, cu săgeți mici, ca câmpul să fie interactiv pe un ecran îngust. */
export const PHONE: TierConfig = { nx: 20, ny: 18, nz: 2, step: 0.26, dpr: [1, 1.5] };

export const TIER_ORDER = ['high', 'mid', 'low'] as const;

export function hasWebGL2(): boolean {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

export function detectTier(): Tier {
  if (typeof window === 'undefined' || !hasWebGL2()) return 'fallback';
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (coarse || window.innerWidth < 768 || nav.connection?.saveData) return 'low';
  const cores = navigator.hardwareConcurrency ?? 4;
  return cores >= 8 ? 'high' : 'mid';
}
