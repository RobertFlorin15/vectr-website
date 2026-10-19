import { motion, useReducedMotion, useScroll } from 'motion/react';
import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { hero } from '../../content/site';
import { useInViewport } from '../../hooks/useInViewport';
import { usePageVisible } from '../../hooks/usePageVisible';
import { usePointerCharge } from '../../hooks/usePointerCharge';
import { detectTier } from '../../lib/tier';
import { ease } from '../../lib/tokens';
import FieldReadout from '../ui/FieldReadout';
import MaskedLines from '../ui/MaskedLines';
import Nav from '../ui/Nav';
import VectorButton from '../ui/VectorButton';
import HeroPoster from './HeroPoster';

// Preload the Three.js chunk as soon as the script starts:
const heroCanvasPromise = import('../canvas/HeroCanvas');
const HeroCanvas = lazy(() => heroCanvasPromise);

const EASE_OUT: [number, number, number, number] = [...ease.out];

export default function Hero() {
  const reduce = useReducedMotion() ?? false;
  const section = useRef<HTMLElement>(null);
  const readout = useRef<HTMLElement>(null);
  const textEnd = useRef<HTMLDivElement>(null);
  /** Phone: fraction of the hero height where the field area begins, below the text. */
  const fieldTop = useRef(0.6);
  const inView = useInViewport(section);
  const visible = usePageVisible();
  const charge = usePointerCharge(section);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });

  const [mountCanvas, setMountCanvas] = useState(false);
  const [ready, setReady] = useState(false);
  const [posterGone, setPosterGone] = useState(false);
  const [failed, setFailed] = useState(false);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    setTouch(window.matchMedia('(pointer: coarse)').matches);
    if (detectTier() === 'fallback') {
      setFailed(true);
      return;
    }
    setMountCanvas(true);
  }, []);

  useEffect(() => {
    const sec = section.current;
    const end = textEnd.current;
    if (!sec || !end) return;
    const measure = () => {
      const s = sec.getBoundingClientRect();
      const e = end.getBoundingClientRect();
      if (s.height > 0) fieldTop.current = Math.min(0.9, Math.max(0.3, (e.bottom - s.top + 24) / s.height));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(sec);
    ro.observe(end);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const id = window.setTimeout(() => setPosterGone(true), reduce ? 0 : 650);
    return () => window.clearTimeout(id);
  }, [ready, reduce]);

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: reduce ? { opacity: 1 } : { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.3 : 0.8, ease: EASE_OUT, delay },
  });

  const showCanvas = mountCanvas && !failed;

  return (
    <section
      id="top"
      ref={section}
      data-ink="light"
      className="relative isolate min-h-svh overflow-hidden bg-void text-ink md:h-svh md:min-h-[34rem]"
      style={{ touchAction: 'pan-y', userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
      onContextMenu={(e) => {
        // A long press on touch inverts the charge; do not open the context menu.
        if (touch) e.preventDefault();
      }}
    >
      {!posterGone && <HeroPoster />}

      {showCanvas && (
        <motion.div
          aria-hidden
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : 0.6, ease: 'easeOut' }}
        >
          <Suspense fallback={null}>
            <HeroCanvas
              charge={charge}
              scroll={scrollYProgress}
              readout={readout}
              fieldTop={fieldTop}
              active={inView && visible}
              reduced={reduce}
              onReady={() => setReady(true)}
              onFail={() => {
                setFailed(true);
                setPosterGone(false);
              }}
            />
          </Suspense>
        </motion.div>
      )}

      <Nav />

      <div className="relative z-10 flex flex-col justify-start pb-[78vw] pt-28 pl-(--margin) pr-(--margin) md:h-full md:justify-center md:pb-0 md:pt-0 md:pl-[8%]">
        <h1 className="max-w-[12ch] -ml-[0.05em] text-balance text-display font-semibold tracking-[-0.035em]">
          <MaskedLines lines={[...hero.headline]} delay={0.1} />
        </h1>

        <motion.p {...rise(0.45)} className="mt-5 max-w-[40ch] text-body md:text-lead tracking-[-0.005em] md:mt-8 md:max-w-[34ch]">
          {hero.lead}
        </motion.p>

        <div ref={textEnd} className="mt-7 flex flex-col items-start gap-5 md:mt-10 md:flex-row md:items-end md:justify-between">
          <motion.div {...rise(0.54)}>
            <VectorButton href={hero.cta.href}>{hero.cta.label}</VectorButton>
          </motion.div>
          <motion.div {...rise(0.62)} className="md:text-right">
            <FieldReadout valueRef={readout} />
            <p className="mt-2 max-w-[40ch] text-small text-muted md:ml-auto">{touch ? hero.hintTouch : hero.hint}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
