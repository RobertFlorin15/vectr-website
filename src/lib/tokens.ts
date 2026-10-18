export const ease = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.76, 0, 0.24, 1],
  soft: [0.33, 1, 0.68, 1],
} as const;

export const dur = {
  press: 0.14,
  hover: 0.18,
  ui: 0.24,
  reveal: 0.8,
  shutter: 1.1,
  imageSettle: 1.5,
} as const;
