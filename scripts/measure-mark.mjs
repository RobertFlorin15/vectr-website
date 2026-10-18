// Măsoară razele din logos/logo_grafic_nou.jpg: unghi, lungime, grosime. Rezultatul alimentează src/lib/logo.ts.
import { createRequire } from 'node:module';
const require = createRequire(new URL('../node_modules/potrace/', import.meta.url));
const Jimp = require('jimp');
const img = await Jimp.read('logos/logo_grafic_nou.jpg');
const W = img.bitmap.width, H = img.bitmap.height, d = img.bitmap.data;
const white = (x, y) => {
  x = Math.round(x); y = Math.round(y);
  if (x < 0 || y < 0 || x >= W || y >= H) return false;
  return d[(y * W + x) * 4] > 128;
};
// origine: centroid al pixelilor albi din jurul estimării
let ox = 1299, oy = 877;
for (let it = 0; it < 10; it++) {
  let sx = 0, sy = 0, n = 0;
  for (let y = oy - 60; y <= oy + 60; y++) for (let x = ox - 60; x <= ox + 60; x++) if (white(x, y) && (x - ox) ** 2 + (y - oy) ** 2 < 3600) { sx += x; sy += y; n++; }
  ox = sx / n; oy = sy / n;
}
console.error('origin', ox.toFixed(1), oy.toFixed(1));
const STEP = 0.1; // grade
const N = 3600;
const reach = new Float64Array(N);
for (let i = 0; i < N; i++) {
  const a = (i * STEP * Math.PI) / 180;
  const c = Math.cos(a), s = -Math.sin(a); // y în sus
  let r = 0, miss = 0, last = 0;
  for (r = 30; r < 1300; r += 1) {
    if (white(ox + c * r, oy + s * r)) { last = r; miss = 0; } else if (++miss > 3) break;
  }
  reach[i] = last;
}
// maxime locale ale razei pe o fereastră de ±3°
const w = 30, peaks = [];
for (let i = 0; i < N; i++) {
  let isMax = reach[i] > 150;
  for (let k = -w; k <= w && isMax; k++) { const v = reach[(i + k + N) % N]; if (v > reach[i] || (v === reach[i] && k < 0)) isMax = false; }
  if (isMax) peaks.push(i);
}
const out = peaks.map((i) => {
  const L = reach[i];
  // direcția reală: media unghiulară a pixelilor albi la 0.5L (ax mai precis decât vârful)
  const rr = L * 0.5;
  let a0 = i;
  while (white(ox + Math.cos(((a0 - 1) * STEP * Math.PI) / 180) * rr, oy - Math.sin(((a0 - 1) * STEP * Math.PI) / 180) * rr) && i - a0 < 200) a0--;
  let a1 = i;
  while (white(ox + Math.cos(((a1 + 1) * STEP * Math.PI) / 180) * rr, oy - Math.sin(((a1 + 1) * STEP * Math.PI) / 180) * rr) && a1 - i < 200) a1++;
  const mid = (a0 + a1) / 2;
  const width = ((a1 - a0) * STEP * Math.PI) / 180 * rr;
  return { theta: +(mid * STEP).toFixed(1), L, width };
});
const Lmax = Math.max(...out.map((o) => o.L));
const res = out.map((o) => ({ theta: o.theta, L: +(o.L / Lmax).toFixed(3), w: +(o.width / Lmax).toFixed(4) })).sort((a, b) => a.theta - b.theta);
console.log(JSON.stringify(res));
console.error(res.length, 'rays; Lmax px', Lmax);
