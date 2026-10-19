import { FIELD_GLSL } from '../../../lib/field.constants';

/** The field F(p) in GLSL. Mirrored in lib/field.ts; constants come from field.constants.ts. */
export const fieldGLSL = /* glsl */ `
${FIELD_GLSL}

uniform float uTime;
uniform float uIntro;
uniform float uPtrAmp;
uniform float uPolarity;
uniform vec3 uPointer;
uniform float uFieldScale; // phone: the field is sampled over a wider domain so the emblem and flow fit
uniform float uSrcGain;
uniform float uFlowGain;
uniform float uPtrGain;

vec3 fieldSrc(vec3 p) {
  float rho = length(p.xy);
  float phi = rho > 1e-5 ? atan(p.y, p.x) : 0.0;
  float sig = clamp(RAY_HALF_WIDTH / max(rho, 0.01), SIG_THETA, SIG_THETA_MAX);
  float K = 0.0;
  float wSum = 0.0;
  float wL = 0.0;
  for (int i = 0; i < N_RAYS; i++) {
    float d = phi - RAY_THETA[i];
    d = atan(sin(d), cos(d));
    K += (RAY_AMP_BASE + RAY_AMP_L * RAY_L[i]) * exp(-d * d / (2.0 * sig * sig));
    float w = exp(-d * d / (2.0 * SIG_BLEND * SIG_BLEND));
    wSum += w;
    wL += w * RAY_L[i];
  }
  float Lstar = wL / wSum;
  vec3 dir = vec3(p.xy, Z_SQUASH * p.z);
  float dl = length(dir);
  dir = dl > 1e-4 ? dir / dl : vec3(0.0, 0.0, 1.0);
  return dir * (A0 + A1 * K) * exp(-rho / (R_DECAY * Lstar));
}

vec3 fieldFlow(vec3 p, float t) {
  float dpsix = 0.0;
  float dpsiy = 0.0;
  for (int j = 0; j < 3; j++) {
    float ca = cos(FLOW_ALPHA[j]);
    float sa = sin(FLOW_ALPHA[j]);
    float ph = FLOW_K[j] * (p.x * ca + p.y * sa) + FLOW_W[j] * t + FLOW_BETA[j];
    float c = cos(ph) * FLOW_A[j] * FLOW_K[j];
    dpsix += c * ca;
    dpsiy += c * sa;
  }
  return vec3(dpsiy, -dpsix, FLOW_Z_AMP * sin(0.7 * p.x + 0.2 * t));
}

vec3 fieldPtr(vec3 p) {
  vec3 c = p - uPointer * uFieldScale;
  float g = exp(-dot(c, c) / (2.0 * PTR_SIGMA * PTR_SIGMA));
  return g * (-uPolarity * PTR_KA * c + PTR_KS * vec3(-c.y, c.x, 0.0));
}

vec3 fieldTotal(vec3 p) {
  vec3 q = p * uFieldScale;
  return uIntro * (uSrcGain * fieldSrc(q) + uFlowGain * fieldFlow(q, uTime)) + uPtrAmp * uPtrGain * fieldPtr(q);
}
`;
