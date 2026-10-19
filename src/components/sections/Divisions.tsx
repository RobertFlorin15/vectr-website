import { motion, useReducedMotion } from 'motion/react';
import { useRef, useState, useSyncExternalStore, type KeyboardEvent } from 'react';
import { divisions } from '../../content/site';
import { useElementHeight } from '../../hooks/useElementHeight';
import { ease } from '../../lib/tokens';
import { vectorClip } from '../../lib/vectorClip';
import Chevron from '../ui/Chevron';
import Reveal from '../ui/Reveal';
import VectorMask from '../ui/VectorMask';

const INOUT: [number, number, number, number] = [...ease.inOut];
const OUT: [number, number, number, number] = [...ease.out];

const mq = '(min-width: 768px)';
function useIsDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(mq);
      m.addEventListener('change', cb);
      return () => m.removeEventListener('change', cb);
    },
    () => window.matchMedia(mq).matches,
    () => true,
  );
}

/** Divisions: the white break. The large vector-cut shape rotates toward the active division direction (SPEC §7.4). */
export default function Divisions() {
  const reduce = useReducedMotion();
  const desktop = useIsDesktop();
  const [active, setActive] = useState(0);
  const [angle, setAngle] = useState<number>(divisions.items[0].angle);
  const angleRef = useRef<number>(divisions.items[0].angle);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const shape = useRef<HTMLDivElement>(null);
  const shapeH = useElementHeight(shape);

  const select = (i: number) => {
    // Shortest path between angles.
    const delta = ((((divisions.items[i].angle - angleRef.current) % 360) + 540) % 360) - 180;
    angleRef.current += delta;
    setAngle(angleRef.current);
    setActive(i);
  };

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = divisions.items.length;
    let next = i;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % n;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i + n - 1) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    else return;
    e.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  };

  const current = divisions.items[active];

  return (
    <section
      id="divizii"
      data-ink="dark"
      className="overflow-hidden bg-ink px-(--margin) py-12 text-void md:grid md:grid-cols-12 md:items-center md:gap-(--gutter) md:py-24"
    >
      {/* List: the first row is the title, then the 3 divisions, then the active division fact */}
      <div className="relative z-10 min-w-0 md:col-span-5">
        <Reveal as="p" className="mb-2 hidden text-head font-semibold leading-[1.15] tracking-[-0.03em] text-graphite md:block">
          {divisions.title}
        </Reveal>
        <div
          role="tablist"
          aria-label={divisions.title}
          className="flex flex-col"
        >
          {divisions.items.map((d, i) => {
            const on = i === active;
            return (
              <Reveal key={d.id} delay={0.075 * (i + 1)}>
                <button
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  id={`tab-${d.id}`}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  aria-controls="panou-divizie"
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={`group flex min-h-11 items-center gap-[0.35em] text-left text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] transition-colors duration-[180ms] hover:text-void md:text-head ${on ? 'text-void' : 'text-graphite'}`}
                >
                  <Chevron
                    className={`flex-none transition-[opacity,transform] duration-[180ms] ${on ? 'translate-x-0 opacity-100' : '-translate-x-1.5 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100'}`}
                  />
                  {d.name}
                </button>
              </Reveal>
            );
          })}
        </div>
        <p
          key={current.id}
          aria-live="polite"
          className="mt-8 hidden max-w-[40ch] animate-[fade-in_0.3s_ease_both] text-body [text-wrap:pretty] motion-reduce:animate-none md:block"
        >
          {current.fact}
        </p>
      </div>

      {/* Large solid shape with its tip rotated toward the division direction; the image sits in front of it, unrotated */}
      <div className="relative order-first mx-auto mb-8 aspect-[4/3] w-full [--k:0.9] md:order-none md:aspect-[1.6/1] md:col-span-7 md:col-start-6 md:my-24 md:mb-24 md:w-full md:[--k:0.9]">
        <motion.div
          className="absolute inset-0 hidden md:block"
          initial={reduce ? false : { scaleX: 0.6, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: reduce ? 0 : 0.8, ease: OUT }}
        >
          <motion.div
            ref={shape}
            aria-hidden
            className="absolute left-1/2 top-1/2 aspect-[1.6/1] h-[calc(var(--k)*100%)] -translate-x-1/2 -translate-y-1/2 bg-void"
            style={{ clipPath: shapeH ? vectorClip(shapeH, 'right') : undefined }}
            animate={{ rotate: desktop ? angle : 0 }}
            transition={{ duration: reduce ? 0 : 0.6, ease: INOUT }}
          />
        </motion.div>

        <div
          role="tabpanel"
          id="panou-divizie"
          aria-labelledby={`tab-${current.id}`}
          className="absolute inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:aspect-[4/3] md:h-[calc(var(--k)*78%)] md:-translate-x-1/2 md:-translate-y-1/2"
        >
          <VectorMask className="relative size-full overflow-hidden bg-graphite">
            {divisions.items.map((d, i) => (
              <img
                key={d.id}
                src={d.image.src}
                alt={i === active ? d.image.alt : ''}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover grayscale contrast-[1.08] transition-opacity duration-300"
                style={{ opacity: i === active ? 1 : 0 }}
              />
            ))}
          </VectorMask>
        </div>
      </div>

      {/* On phones, the fact comes below the list */}
      <p className="relative z-10 mt-4 max-w-[40ch] text-body [text-wrap:pretty] md:hidden">{current.fact}</p>
    </section>
  );
}
