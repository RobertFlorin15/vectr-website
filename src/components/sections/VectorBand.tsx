import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

/**
 * Banda-vector dintre cele două jumătăți (SPEC §7.5). Crește în magnitudine la scroll.
 * Corpul se scalează pe x, vârful e un element separat translatat, deci nu se deformează.
 */
export default function VectorBand() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const p = useTransform(scrollYProgress, [0, 1], [0.35, 1]);
  const tipX = useTransform(p, (v) => `calc(${v} * (100cqw - var(--bh) / 2))`);

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative h-16 overflow-hidden bg-ground [--bh:4rem] md:h-24 md:[--bh:6rem]"
      style={{ containerType: 'inline-size' }}
    >
      <motion.div
        className="absolute inset-y-0 left-0 w-[calc(100cqw-var(--bh)/2)] origin-left bg-ink"
        style={{ scaleX: reduce ? 1 : p }}
      />
      <motion.div
        className="absolute inset-y-0 left-0 w-[calc(var(--bh)/2)] bg-ink [clip-path:polygon(0_0,100%_50%,0_100%)]"
        style={{ x: reduce ? 'calc(100cqw - var(--bh) / 2)' : tipX }}
      />
    </div>
  );
}
