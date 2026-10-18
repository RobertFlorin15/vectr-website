import { motion, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { dur, ease } from '../../lib/tokens';

const EASE_OUT: [number, number, number, number] = [...ease.out];

type Tag = 'div' | 'li' | 'p' | 'h2' | 'h3' | 'section';

interface Props {
  as?: Tag;
  delay?: number;
  y?: number;
  className?: string;
  children: ReactNode;
}

/**
 * Intrare la scroll (SPEC §8). Conținutul nu rămâne niciodată ascuns:
 * se afișează forțat după 1.5s dacă IntersectionObserver nu a declanșat.
 */
export default function Reveal({ as = 'div', delay = 0, y = 24, className, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const seen = useInView(ref, { once: true, amount: 0.2, margin: '0px 0px -12% 0px' });
  const [forced, setForced] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setForced(true), 1500);
    return () => window.clearTimeout(id);
  }, []);

  const M = motion[as] as typeof motion.div;
  const shown = seen || forced || typeof IntersectionObserver === 'undefined';
  return (
    <M
      ref={ref as never}
      className={className}
      initial={false}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: reduce ? 0 : y }}
      transition={{ duration: reduce ? 0.3 : dur.reveal, ease: EASE_OUT, delay: shown ? delay : 0 }}
    >
      {children}
    </M>
  );
}
