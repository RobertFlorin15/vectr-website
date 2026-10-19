import BurstMark from '../ui/BurstMark';

/**
 * Static fallback (SPEC §5.9): the VECTR mark as SVG, at the same position and scale as the field origin.
 * Shown before the canvas loads and when WebGL is unavailable.
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
