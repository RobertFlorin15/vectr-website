import { motion, useReducedMotion } from 'motion/react';
import { projects } from '../../content/site';
import { dur, ease } from '../../lib/tokens';
import Reveal from '../ui/Reveal';
import VectorButton from '../ui/VectorButton';
import VectorMask from '../ui/VectorMask';

const SOFT: [number, number, number, number] = [...ease.soft];

type Item = (typeof projects.items)[number];

/** Culorile benzilor, în ordine: surface → surface2 → graphite → muted (SPEC §4.1, §7.6). */
const BANDS = [
  { bg: 'bg-surface', fg: 'text-ink', sub: 'text-muted', zebra: 'bg-void/25', tab: 'ink' },
  { bg: 'bg-surface2', fg: 'text-ink', sub: 'text-muted', zebra: 'bg-void/25', tab: 'ink' },
  { bg: 'bg-graphite', fg: 'text-ink', sub: 'text-ink', zebra: 'bg-void/25', tab: 'ink' },
  { bg: 'bg-muted', fg: 'text-void', sub: 'text-surface2', zebra: 'bg-void/10', tab: 'void' },
] as const;

function Folder({ p, i }: { p: Item; i: number }) {
  const reduce = useReducedMotion();
  const b = BANDS[i];
  return (
    <motion.article
      id={`proiect-${p.id}`}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: reduce ? 0 : dur.reveal, ease: [...ease.out] as [number, number, number, number] }}
      className={`relative mt-16 flex min-h-svh flex-col px-(--margin) pb-16 md:sticky md:mt-0 md:min-h-[calc(80svh+64px)] md:top-[var(--top)] md:pb-24 ${b.bg} ${b.fg}`}
      style={{ ['--top' as string]: `${i * 64}px` }}
    >
      {/* Tab-ul se ridică din colțul stânga-sus al benzii */}
      <div className="absolute bottom-full left-(--margin)">
        <VectorButton href={`#proiect-${p.id}`} tone={b.tab} size="sm" className="[&_.vbtn__body]:min-w-[180px] md:[&_.vbtn__body]:min-w-[220px] [&_.vbtn__body]:text-[1.25rem] [&_.vbtn__body]:font-semibold md:[&_.vbtn__body]:text-lead">
          {p.name}
        </VectorButton>
      </div>

      {/* Fâșia vizibilă de 64px: categoria, aliniată dreapta */}
      <div className="flex h-16 items-center justify-end">
        <p className={`text-body ${b.sub}`}>{p.category}</p>
      </div>

      <div className="mt-6 grid gap-10 md:mt-10 md:grid-cols-12 md:gap-(--gutter)">
        <figure className="md:col-span-7">
          <VectorMask className="aspect-[4/3] overflow-hidden md:aspect-[16/10]">
            <motion.img
              src={p.image.src}
              alt={p.image.alt}
              loading="lazy"
              decoding="async"
              className="size-full object-cover grayscale contrast-[1.08]"
              initial={reduce ? false : { scale: 1.04 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: reduce ? 0 : 0.8, ease: SOFT }}
            />
          </VectorMask>
          <figcaption className={`mt-3 text-small ${b.sub}`}>{projects.photoNote}</figcaption>
        </figure>

        <div className="md:col-span-4 md:col-start-9">
          <Reveal as="p" className="max-w-[62ch] text-body [text-wrap:pretty]">
            {p.description}
          </Reveal>
          <Reveal className="mt-8">
            <table className="w-full border-collapse text-left text-small">
              <caption className="sr-only">Specificații {p.name}</caption>
              <tbody>
                {p.specs.map(([k, v], r) => (
                  <tr key={k} className={r % 2 === 0 ? b.zebra : ''}>
                    <th scope="row" className="px-3 py-2.5 font-normal">
                      {k}
                    </th>
                    <td className="num px-3 py-2.5 text-right">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <Reveal className="mt-8">
            <a href={`#proiect-${p.id}`} className="link text-body font-medium">
              {projects.detailsLabel}
            </a>
          </Reveal>
        </div>
      </div>
    </motion.article>
  );
}

/** Proiecte: dosare suprapuse, cu taburi vector-cut (SPEC §7.6). */
export default function Projects() {
  return (
    <section id="proiecte" data-ink="light" className="bg-ground pt-[var(--section)]">
      <div className="px-(--margin) pb-[120px]">
        <Reveal as="h2" className="text-head font-semibold tracking-[-0.03em]">
          {projects.heading}
        </Reveal>
      </div>
      <div className="relative">
        {projects.items.map((p, i) => (
          <Folder key={p.id} p={p} i={i} />
        ))}
      </div>
    </section>
  );
}
