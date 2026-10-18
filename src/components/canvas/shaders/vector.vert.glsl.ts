import { fieldGLSL } from './field.glsl';

export const vectorVert = /* glsl */ `
${fieldGLSL}

attribute vec3 aBase;
attribute float aPart; // 0 = fus, 1 = vârf

uniform float uScroll;
uniform float uArrowScale;
uniform float uMaskMode;
uniform float uMaskTop;  // pe telefon: fracția din înălțime (de sus) de unde începe câmpul // 0 = zonă calmă pe x (desktop), 1 = mascare pe y (telefon)
uniform vec2 uFog;       // adâncimea la care începe / se termină ceața

varying float vB;
varying vec3 vN;

void main() {
  vec3 F = fieldTotal(aBase);
  float m = length(F);
  float L = L_MIN + (L_MAX - L_MIN) * (1.0 - exp(-m / F0));
  vec3 d = F / max(m, 1e-4);

  // Lungimea codifică magnitudinea; vârful rămâne proporțional când săgeata e foarte scurtă.
  float hl = min(HEAD_LEN, L);
  float hs = hl / HEAD_LEN;
  vec3 lp = position;
  vec3 ln = normal;
  if (aPart < 0.5) {
    lp.y *= (L - hl);
  } else {
    lp.xz *= hs;
    lp.y = lp.y * hl + (L - hl);
  }

  lp *= uArrowScale;

  // Bază ortonormală cu up = d
  vec3 helper = abs(d.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 t1 = normalize(cross(helper, d));
  vec3 t2 = cross(d, t1);
  vec3 rp = lp.x * t1 + lp.y * d + lp.z * t2;
  vec3 rn = ln.x * t1 + ln.y * d + ln.z * t2;

  vec4 mv = modelViewMatrix * vec4(aBase + rp, 1.0);
  gl_Position = projectionMatrix * mv;

  // Zonă calmă: luminozitatea e înmulțită cu o mască pe poziția ecranului a originii săgeții.
  vec4 cp = projectionMatrix * modelViewMatrix * vec4(aBase, 1.0);
  vec2 s = cp.xy / cp.w * 0.5 + 0.5;
  float calm = uMaskMode < 0.5 ? smoothstep(0.40, 0.56, s.x) : smoothstep(uMaskTop, uMaskTop + 0.08, 1.0 - s.y);

  float fogZ = 1.0 - 0.75 * smoothstep(uFog.x, uFog.y, -mv.z);
  float b = mix(B_MIN, 1.0, smoothstep(0.15, 0.7, m / M_REF)) * fogZ * calm;
  vB = b * (1.0 - 0.5 * uScroll);
  vN = normalize(mat3(modelViewMatrix) * rn);
}
`;
