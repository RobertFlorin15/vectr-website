import { animate } from 'motion/react';
import { useEffect, useRef, type RefObject } from 'react';
import { ease } from '../lib/tokens';

/**
 * The visitor charge: pointer position in NDC, presence and polarity.
 * A mutable object read in useFrame, so no React re-render (SPEC §5.5–5.6).
 */
export interface Charge {
  ndcX: number;
  ndcY: number;
  present: boolean;
  everPresent: boolean;
  polarity: number; // +1 attraction, −1 repulsion
  onChange: (() => void) | null;
}

const TAP_HOLD_MS = 2500;
const LONG_PRESS_TOUCH_MS = 220;
const EASE_OUT: [number, number, number, number] = [...ease.out];

export function usePointerCharge(target: RefObject<HTMLElement | null>) {
  const charge = useRef<Charge>({
    ndcX: 0,
    ndcY: 0,
    present: false,
    everPresent: false,
    polarity: 1,
    onChange: null,
  });

  useEffect(() => {
    const el = target.current;
    if (!el) return;
    const c = charge.current;
    let polarityAnim: { stop: () => void } | null = null;
    let tapTimer = 0;
    let pressTimer = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const setPolarity = (to: number, seconds: number) => {
      polarityAnim?.stop();
      if (reduced) {
        c.polarity = to;
        c.onChange?.();
        return;
      }
      polarityAnim = animate(c.polarity, to, {
        duration: seconds,
        ease: EASE_OUT,
        onUpdate: (v) => {
          c.polarity = v;
        },
      });
    };

    const place = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      c.ndcX = ((e.clientX - r.left) / r.width) * 2 - 1;
      c.ndcY = -(((e.clientY - r.top) / r.height) * 2 - 1);
      c.present = true;
      c.everPresent = true;
      c.onChange?.();
    };

    const isControl = (t: EventTarget | null) =>
      t instanceof Element && !!t.closest('a, button, input, select, textarea');

    const onMove = (e: PointerEvent) => {
      // On touch, a horizontal drag moves the charge (vertical scroll stays free: touch-action pan-y).
      place(e);
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      c.present = false;
      c.onChange?.();
    };
    const onDown = (e: PointerEvent) => {
      if (isControl(e.target)) return;
      place(e);
      window.clearTimeout(tapTimer);
      if (e.pointerType === 'touch') {
        pressTimer = window.setTimeout(() => setPolarity(-1, 0.1), LONG_PRESS_TOUCH_MS);
      } else {
        setPolarity(-1, 0.24);
      }
    };
    const onUp = (e: PointerEvent) => {
      window.clearTimeout(pressTimer);
      setPolarity(1, e.pointerType === 'touch' ? 0.08 : 0.17);
      if (e.pointerType === 'touch') {
        tapTimer = window.setTimeout(() => {
          c.present = false;
          c.onChange?.();
        }, TAP_HOLD_MS);
      }
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.clearTimeout(tapTimer);
      window.clearTimeout(pressTimer);
      polarityAnim?.stop();
    };
  }, [target]);

  return charge;
}
