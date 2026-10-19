import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { FIELD } from '../../lib/field.constants';

/** A single arrow: shaft (cylinder, y 0→1) + head (cone, y 0→1), with the aPart attribute. */
export function createArrowGeometry(): THREE.BufferGeometry {
  const shaft = new THREE.CylinderGeometry(FIELD.shaftRadius, FIELD.shaftRadius, 1, 6, 1, true);
  shaft.translate(0, 0.5, 0);
  const head = new THREE.ConeGeometry(FIELD.headRadius, 1, 8, 1, false);
  head.translate(0, 0.5, 0);

  for (const [g, part] of [[shaft, 0], [head, 1]] as const) {
    g.setAttribute('aPart', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count).fill(part), 1));
    g.deleteAttribute('uv');
  }
  const merged = mergeGeometries([shaft, head], false);
  shaft.dispose();
  head.dispose();
  if (!merged) throw new Error('arrowGeometry: merge failed');
  return merged;
}
