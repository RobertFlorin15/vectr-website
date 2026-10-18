export const vectorFrag = /* glsl */ `
varying float vB;
varying vec3 vN;

void main() {
  float shade = 0.62 + 0.38 * max(dot(normalize(vN), normalize(vec3(-0.4, 0.6, 0.7))), 0.0);
  gl_FragColor = vec4(vec3(vB * shade), 1.0);
}
`;
