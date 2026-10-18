import potrace from 'potrace';
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const Jimp = require('jimp');
const img = await Jimp.read('logos/logo_text.png');
let minX = 1e9, minY = 1e9, maxX = -1, maxY = -1;
img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
  const a = this.bitmap.data[idx + 3];
  const on = a >= 128;
  if (on) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
  const v = on ? 0 : 255;
  this.bitmap.data[idx] = this.bitmap.data[idx + 1] = this.bitmap.data[idx + 2] = v;
  this.bitmap.data[idx + 3] = 255;
});
console.log('bbox', minX, minY, maxX, maxY);
const buf = await img.getBufferAsync(Jimp.MIME_PNG);
potrace.trace(buf, { threshold: 128, turdSize: 2, alphaMax: 1.0, optTolerance: 0.2 }, (err, svg) => {
  if (err) throw err;
  const d = [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]).join(' ');
  const pad = 2, w = maxX - minX + 1 + pad * 2, h = maxY - minY + 1 + pad * 2;
  const out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX - pad} ${minY - pad} ${w} ${h}" fill="currentColor" role="img" aria-label="VECTR"><path fill-rule="evenodd" d="${d}"/></svg>\n`;
  fs.writeFileSync('public/brand/vectr-wordmark.svg', out);
  fs.rmSync('public/brand/vectr-wordmark.raw.svg', { force: true });
  console.log(w, h, out.length);
});
