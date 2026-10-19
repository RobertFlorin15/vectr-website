/** clip-path: polygon() for a rectangle whose end edge is a 90° tip (SPEC §4.3). */
export function vectorClip(h: number, dir: 'right' | 'left' | 'up' | 'down' = 'right'): string {
  const t = h * 0.5;
  switch (dir) {
    case 'right':
      return `polygon(0 0, calc(100% - ${t}px) 0, 100% 50%, calc(100% - ${t}px) 100%, 0 100%)`;
    case 'left':
      return `polygon(${t}px 0, 100% 0, 100% 100%, ${t}px 100%, 0 50%)`;
    case 'up':
      return `polygon(50% 0, 100% ${t}px, 100% 100%, 0 100%, 0 ${t}px)`;
    case 'down':
      return `polygon(0 0, 100% 0, 100% calc(100% - ${t}px), 50% 100%, 0 calc(100% - ${t}px))`;
  }
}
