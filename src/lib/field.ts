import { FIELD } from './field.constants';

/** Starea pointerului în coordonate locale ale rețelei (origine = O). */
export interface PointerSample {
  x: number;
  y: number;
  z: number;
  amp: number;
  polarity: number;
}


function wrap(d: number) {
  return Math.atan2(Math.sin(d), Math.cos(d));
}

/**
 * Evaluarea lui F(p) pe CPU, formulă cu formulă identică cu field.glsl.ts.
 * Scrie rezultatul în `out` (zero alocări). uIntro = 1.
 */
export interface FieldGains {
  scale: number;
  src: number;
  flow: number;
  ptr: number;
}

const DESKTOP_GAINS: FieldGains = { scale: 1, src: 1, flow: 1, ptr: 1 };

export function evaluateField(
  out: Float64Array,
  px: number,
  py: number,
  pz: number,
  t: number,
  ptr?: PointerSample,
  gains: FieldGains = DESKTOP_GAINS,
) {
  const F = FIELD;
  px *= gains.scale;
  py *= gains.scale;
  pz *= gains.scale;

  // (a) sursa-emblemă
  const rho = Math.hypot(px, py);
  const phi = rho > 1e-5 ? Math.atan2(py, px) : 0;
  const sig = Math.min(Math.max(F.rayHalfWidth / Math.max(rho, 0.01), F.sigmaTheta), F.sigmaThetaMax);
  let K = 0;
  let wSum = 0;
  let wL = 0;
  for (let i = 0; i < F.rayL.length; i++) {
    const d = wrap(phi - F.rayTheta[i]);
    K += (F.rayAmpBase + F.rayAmpL * F.rayL[i]) * Math.exp((-d * d) / (2 * sig * sig));
    const w = Math.exp((-d * d) / (2 * F.sigmaDecayBlend * F.sigmaDecayBlend));
    wSum += w;
    wL += w * F.rayL[i];
  }
  const Lstar = wL / wSum;
  let dx = px;
  let dy = py;
  let dz = F.zSquash * pz;
  const dl = Math.hypot(dx, dy, dz);
  if (dl > 1e-4) {
    dx /= dl;
    dy /= dl;
    dz /= dl;
  } else {
    dx = 0;
    dy = 0;
    dz = 1;
  }
  const srcMag = (F.a0 + F.a1 * K) * Math.exp(-rho / (F.R * Lstar));
  let fx = gains.src * dx * srcMag;
  let fy = gains.src * dy * srcMag;
  let fz = gains.src * dz * srcMag;

  // (b) curgerea
  let dpsix = 0;
  let dpsiy = 0;
  for (let j = 0; j < 3; j++) {
    const ca = Math.cos(F.flowAlpha[j]);
    const sa = Math.sin(F.flowAlpha[j]);
    const ph = F.flowK[j] * (px * ca + py * sa) + F.flowW[j] * t + F.flowBeta[j];
    const c = Math.cos(ph) * F.flowA[j] * F.flowK[j];
    dpsix += c * ca;
    dpsiy += c * sa;
  }
  fx += gains.flow * dpsiy;
  fy += gains.flow * -dpsix;
  fz += gains.flow * F.flowZAmp * Math.sin(0.7 * px + 0.2 * t);

  // (c) pointerul
  if (ptr && ptr.amp > 0) {
    const cx = px - ptr.x * gains.scale;
    const cy = py - ptr.y * gains.scale;
    const cz = pz - ptr.z * gains.scale;
    const g = Math.exp(-(cx * cx + cy * cy + cz * cz) / (2 * F.ptrSigma * F.ptrSigma));
    fx += ptr.amp * gains.ptr * g * (-ptr.polarity * F.ptrKA * cx + F.ptrKS * -cy);
    fy += ptr.amp * gains.ptr * g * (-ptr.polarity * F.ptrKA * cy + F.ptrKS * cx);
    fz += ptr.amp * gains.ptr * g * (-ptr.polarity * F.ptrKA * cz);
  }

  out[0] = fx;
  out[1] = fy;
  out[2] = fz;
}

/** θ în grade, în [0, 360), din componentele (x, y). */
export function fieldAngleDeg(x: number, y: number) {
  const a = (Math.atan2(y, x) * 180) / Math.PI;
  return ((a % 360) + 360) % 360;
}

