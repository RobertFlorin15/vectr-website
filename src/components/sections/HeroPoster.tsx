import BurstMark from '../ui/BurstMark';

/**
 * Fallback static (SPEC §5.9): semnul VECTR în SVG, la aceeași poziție și scară ca originea câmpului.
 * Se vede înainte de încărcarea canvas-ului și fără WebGL.
 */
export default function HeroPoster() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden text-ink">
      <BurstMark
        className="absolute left-1/2 top-[calc(100%-40vw)] aspect-square w-[90vw] -translate-x-1/2 -translate-y-1/2 md:left-[78%] md:top-[55%] md:w-[120svh]"
        pad={0.02}
      />
    </div>
  );
}
