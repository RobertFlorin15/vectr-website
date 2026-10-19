import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { nav } from '../../content/site';
import { ease } from '../../lib/tokens';
import VectorButton from './VectorButton';
import Wordmark from './Wordmark';

const EASE_OUT: [number, number, number, number] = [...ease.out];

/** Absolute nav inside the hero: it scrolls with the page and never covers content (SPEC §7.1). */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const sheet = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = sheet.current;
    const focusables = () => Array.from(root?.querySelectorAll<HTMLElement>('a, button') ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const f = focusables();
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      opener.current?.focus();
    };
  }, [open]);

  return (
    <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-(--margin) pt-5 md:pt-6">
      <a href="#top" aria-label="VECTR">
        <Wordmark height={22} className="h-5 w-auto md:h-[22px]" />
      </a>

      <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
        {nav.links.map((l) => (
          <a key={l.href} href={l.href} className="link text-body font-medium">
            {l.label}
          </a>
        ))}
        <VectorButton href={nav.cta.href} size="sm">
          {nav.cta.label}
        </VectorButton>
      </nav>

      <button
        ref={opener}
        type="button"
        aria-expanded={open}
        aria-controls="meniu"
        onClick={() => setOpen(true)}
        className="link -mr-2 min-h-11 px-2 text-body font-medium md:hidden"
      >
        {nav.menu}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="meniu"
            ref={sheet}
            role="dialog"
            aria-modal="true"
            aria-label="Meniu"
            className="fixed inset-0 z-50 flex flex-col bg-void px-(--margin) pt-5 text-ink md:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)', transition: { duration: reduce ? 0 : 0.24, ease: EASE_OUT } }}
            exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: reduce ? 0 : 0.17, ease: EASE_OUT } }}
          >
            <div className="flex items-center justify-between">
              <Wordmark height={20} />
              <button type="button" onClick={() => setOpen(false)} className="link -mr-2 min-h-11 px-2 text-body font-medium">
                {nav.close}
              </button>
            </div>
            <ul className="mt-16 flex flex-col gap-4 p-0">
              {nav.links.map((l) => (
                <li key={l.href} className="list-none">
                  <a href={l.href} onClick={() => setOpen(false)} className="link text-head font-semibold tracking-[-0.03em]">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-auto pb-8">
              <VectorButton href={nav.cta.href} onClick={() => setOpen(false)}>
                {nav.cta.label}
              </VectorButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
