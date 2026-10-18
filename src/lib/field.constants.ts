import { LOGO_RAYS } from './logo';

/** Constantele câmpului vectorial (SPEC §5.3). Sursă unică pentru GLSL și pentru calculul pe CPU. */
const deg = (d: number) => (d * Math.PI) / 180;

export const FIELD = {
  // (a) sursa-emblemă
  sigmaTheta: deg(6),
  // Anti-aliasing: lățimea unei raze nu scade sub ~0.6 pași de rețea (altfel razele înguste sunt eșantionate rar lângă O).
  rayHalfWidth: 0.24,
  sigmaThetaMax: 0.6,
  sigmaDecayBlend: 0.3, // lățimea mediei netede a lui L* (rad)
  // Amplitudinea unei raze: raza scurtă rămâne vizibilă, lungimea ei se citește din decădere (L*).
  rayAmpBase: 0.6,
  rayAmpL: 0.4,
  a0: 0.18,
  a1: 1.6,
  R: 4.2,
  zSquash: 0.3,
  rayTheta: LOGO_RAYS.map((r) => deg(r.theta)),
  rayL: LOGO_RAYS.map((r) => r.L),

  // (b) curgerea
  flowA: [0.16, 0.1, 0.06],
  flowK: [0.35, 0.62, 1.1],
  flowW: [0.05, 0.08, 0.12],
  flowAlpha: [deg(20), deg(110), deg(245)],
  flowBeta: [0.0, 1.7, 3.1],
  flowZAmp: 0.15,

  // (c) pointerul
  ptrSigma: 1.6,
  ptrKA: 1.1,
  ptrKS: 0.35,

  // (d) săgeata
  Lmin: 0.05,
  Lmax: 0.62,
  F0: 0.55,
  mRef: 1.2,
  bMin: 0.16,
  headLen: 0.09,
  headRadius: 0.035,
  shaftRadius: 0.011,
} as const;

const f = (n: number) => (Number.isInteger(n) ? n.toFixed(1) : String(n));
const arr = (name: string, v: readonly number[]) =>
  `const float ${name}[${v.length}] = float[${v.length}](${v.map(f).join(', ')});`;

/** Constantele ca #define / const GLSL, injectate în shader prin template string. */
export const FIELD_GLSL = /* glsl */ `
#define N_RAYS ${FIELD.rayL.length}
#define SIG_THETA ${f(FIELD.sigmaTheta)}
#define RAY_HALF_WIDTH ${f(FIELD.rayHalfWidth)}
#define SIG_THETA_MAX ${f(FIELD.sigmaThetaMax)}
#define SIG_BLEND ${f(FIELD.sigmaDecayBlend)}
#define RAY_AMP_BASE ${f(FIELD.rayAmpBase)}
#define RAY_AMP_L ${f(FIELD.rayAmpL)}
#define A0 ${f(FIELD.a0)}
#define A1 ${f(FIELD.a1)}
#define R_DECAY ${f(FIELD.R)}
#define Z_SQUASH ${f(FIELD.zSquash)}
#define FLOW_Z_AMP ${f(FIELD.flowZAmp)}
#define PTR_SIGMA ${f(FIELD.ptrSigma)}
#define PTR_KA ${f(FIELD.ptrKA)}
#define PTR_KS ${f(FIELD.ptrKS)}
#define L_MIN ${f(FIELD.Lmin)}
#define L_MAX ${f(FIELD.Lmax)}
#define F0 ${f(FIELD.F0)}
#define M_REF ${f(FIELD.mRef)}
#define B_MIN ${f(FIELD.bMin)}
#define HEAD_LEN ${f(FIELD.headLen)}
${arr('RAY_THETA', FIELD.rayTheta)}
${arr('RAY_L', FIELD.rayL)}
${arr('FLOW_A', FIELD.flowA)}
${arr('FLOW_K', FIELD.flowK)}
${arr('FLOW_W', FIELD.flowW)}
${arr('FLOW_ALPHA', FIELD.flowAlpha)}
${arr('FLOW_BETA', FIELD.flowBeta)}
`;
