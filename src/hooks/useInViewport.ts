import { useEffect, useState, type RefObject } from 'react';

/** true cât timp elementul intersectează viewport-ul (threshold 0). Fără IntersectionObserver rămâne true. */
export function useInViewport(ref: RefObject<Element | null>) {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}
