import { useLayoutEffect, useState, type RefObject } from 'react';

/** Înălțimea elementului în px (ResizeObserver), pentru vârful de 90° exact (SPEC §4.3). */
export function useElementHeight(ref: RefObject<Element | null>) {
  const [h, setH] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setH(el.getBoundingClientRect().height);
    const ro = new ResizeObserver(([entry]) => setH(entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return h;
}
