/**
 * Razele semnului VECTR (logos/logo_grafic_nou.jpg, varianta finală): 22 de vectori dintr-o singură origine.
 * theta: grade de la +x, y în sus. L: lungimea normalizată la cea mai lungă rază.
 * w: grosimea liniei și arm: lungimea brațelor chevronului, ambele în unități de L_max.
 * Valorile sunt citite de pe imagine (±1–2°). Sursa unică pentru semnul SVG și pentru câmpul 3D.
 */
export const LOGO_RAYS = [
  { theta: 18.2, L: 0.576, w: 0.013, arm: 0.058 },
  { theta: 29.2, L: 0.539, w: 0.013, arm: 0.058 },
  { theta: 48.4, L: 0.446, w: 0.013, arm: 0.058 },
  { theta: 69, L: 0.606, w: 0.022, arm: 0.085 },
  { theta: 80.8, L: 0.480, w: 0.022, arm: 0.085 },
  { theta: 104.7, L: 0.372, w: 0.013, arm: 0.058 },
  { theta: 121.9, L: 0.450, w: 0.013, arm: 0.058 },
  { theta: 141.3, L: 0.724, w: 0.034, arm: 0.115 },
  { theta: 160, L: 0.578, w: 0.013, arm: 0.058 },
  { theta: 177.5, L: 0.917, w: 0.022, arm: 0.085 },
  { theta: 189.3, L: 0.500, w: 0.013, arm: 0.058 },
  { theta: 200.2, L: 1.000, w: 0.034, arm: 0.115 },
  { theta: 208.3, L: 0.331, w: 0.013, arm: 0.058 },
  { theta: 221, L: 0.814, w: 0.013, arm: 0.058 },
  { theta: 238.3, L: 0.675, w: 0.013, arm: 0.058 },
  { theta: 252.2, L: 0.368, w: 0.013, arm: 0.058 },
  { theta: 268.2, L: 0.714, w: 0.034, arm: 0.115 },
  { theta: 282.6, L: 0.433, w: 0.013, arm: 0.058 },
  { theta: 303.2, L: 0.606, w: 0.034, arm: 0.115 },
  { theta: 324.5, L: 0.402, w: 0.034, arm: 0.115 },
  { theta: 333.8, L: 0.590, w: 0.013, arm: 0.058 },
  { theta: 358, L: 0.507, w: 0.013, arm: 0.058 },
] as const;

export const CHEVRON_ANGLE = 40;
