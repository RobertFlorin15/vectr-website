import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef } from 'react';
import { credits, footer } from '../../content/site';
import { CHEVRON_ANGLE, LOGO_RAYS } from '../../lib/logo';
import { ease } from '../../lib/tokens';
import Chevron from '../ui/Chevron';
import VectorButton from '../ui/VectorButton';

const OUT: [number, number, number, number] = [...ease.out];
const rad = (d: number) => (d * Math.PI) / 180;

/** Semnul construit mare: se vede doar jumătatea superioară, cu originea pe linia de jos. Razele se desenează din origine (SPEC §7.8). */
function BuiltMark() {
  const ref = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.3 });
  // Doar razele din semiplanul superior (și cele aproape orizontale): ele formează un evantai complet, fără ciot la linia de jos.
  const order = LOGO_RAYS.filter((r) => Math.sin(rad(r.theta)) >= -0.12).sort((a, b) => a.theta - b.theta);
  const go = inView || reduce;

  return (
    <svg
      ref={ref}
      aria-hidden
      focusable="false"
      className="mx-auto block h-auto w-full md:w-[min(100%,calc(38svh*2.257))]"
      viewBox="-0.96 -0.64 1.58 0.7"
      preserveAspectRatio="xMidYMax meet"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {order.map(({ theta, L, w, arm: armLen }, i) => {
        const a = rad(theta);
        const tx = L * Math.cos(a);
        const ty = -L * Math.sin(a);
        const arm = (s: 1 | -1) => {
          const b = a + Math.PI + s * rad(CHEVRON_ANGLE);
          return `${tx + armLen * Math.cos(b)},${ty - armLen * Math.sin(b)}`;
        };
        const delay = reduce ? 0 : i * 0.04;
        return (
          <g key={theta} strokeWidth={w}>
            <motion.line
              x1={0}
              y1={0}
              x2={tx}
              y2={ty}
              initial={{ pathLength: reduce ? 1 : 0 }}
              animate={{ pathLength: go ? 1 : reduce ? 1 : 0 }}
              transition={{ duration: reduce ? 0 : 0.9, ease: OUT, delay }}
            />
            <motion.polyline
              points={`${arm(1)} ${tx},${ty} ${arm(-1)}`}
              initial={{ opacity: reduce ? 1 : 0 }}
              animate={{ opacity: go ? 1 : reduce ? 1 : 0 }}
              transition={{ duration: reduce ? 0 : 0.18, delay: reduce ? 0 : delay + 0.9 }}
            />
          </g>
        );
      })}
    </svg>
  );
}

export default function Footer() {
  return (
    <footer data-ink="light" className="bg-ground px-(--margin) pt-[clamp(3rem,2rem+5vw,6rem)] pb-8 text-ink">
      <BuiltMark />
      <code className="mt-4 block text-center text-muted">{footer.formula}</code>

      <div className="mt-14 grid gap-10 md:grid-cols-12 md:gap-(--gutter)">
        <div className="grid grid-cols-2 gap-8 md:col-span-8">
          {footer.columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-body font-semibold">{col.title}</h2>
              <ul className="mt-4 flex flex-col gap-1 p-0">
                {col.links.map((l) => (
                  <li key={l.label} className="list-none">
                    {l.href ? (
                      <a href={l.href} className="group relative flex min-h-11 items-center text-body">
                        <Chevron className="absolute -left-5 -translate-x-1.5 opacity-0 transition-[opacity,transform] duration-[180ms] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100" />
                        {l.label}
                      </a>
                    ) : (
                      // [DE COMPLETAT] adresa profilului
                      <span className="flex min-h-11 items-center text-body text-muted">{l.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="md:col-span-4">
          <h2 className="text-body font-semibold">{footer.contact.title}</h2>
          <ul className="mt-4 flex flex-col gap-1 p-0">
            {footer.contact.lines.map((l) => (
              <li key={l} className="list-none text-body text-muted">
                {l}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-16 max-w-[110ch] text-small text-muted">
        Imagini și filmare:{' '}
        {credits.map((c, i) => (
          <span key={c.url}>
            <a href={c.url} className="link">„{c.title}”</a> de {c.by}, <a href={c.licenceUrl} className="link">{c.licence}</a>, via {c.via}
            {i < credits.length - 1 ? '; ' : '.'}
          </span>
        ))}
      </p>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-small text-muted">{footer.copyright}</p>
        <VectorButton href={footer.cta.href} size="sm">
          {footer.cta.label}
        </VectorButton>
      </div>
    </footer>
  );
}
