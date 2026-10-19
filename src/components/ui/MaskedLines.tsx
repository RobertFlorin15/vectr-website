import { motion, useReducedMotion } from 'motion/react';
import { ease } from '../../lib/tokens';

const EASE_OUT: [number, number, number, number] = [...ease.out];

/** Line-masked reveal: each line rises from behind its own baseline (SPEC §7.2). */
export default function MaskedLines({ lines, delay = 0, stagger = 0.11 }: { lines: string[]; delay?: number; stagger?: number }) {
  const reduce = useReducedMotion();
  return (
    <>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
          <motion.span
            className="block"
            initial={reduce ? { opacity: 0 } : { y: '110%' }}
            animate={reduce ? { opacity: 1 } : { y: '0%' }}
            transition={{ duration: reduce ? 0.3 : 0.9, ease: EASE_OUT, delay: delay + i * stagger }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </>
  );
}

