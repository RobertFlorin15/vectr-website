import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef } from 'react';
import { about } from '../../content/site';
import { dur, ease } from '../../lib/tokens';
import Reveal from '../ui/Reveal';
import VectorButton from '../ui/VectorButton';
import VectorMask from '../ui/VectorMask';

const INOUT: [number, number, number, number] = [...ease.inOut];
const SOFT: [number, number, number, number] = [...ease.soft];

/** Despre: panou inset, portret mascat în vector-cut, cu shutter-ul unic al paginii (SPEC §7.3). */
export default function About() {
  const reduce = useReducedMotion();
  const photo = useRef<HTMLDivElement>(null);
  const open = useInView(photo, { once: true, amount: 0.25 });
  const { loopFrom, loopTo } = about.video;

  return (
    <section id="despre" data-ink="light" className="bg-ground px-2.5 py-2.5 md:p-5">
      <div className="relative flex flex-col overflow-hidden bg-surface p-5 md:grid md:grid-cols-[63fr_37fr] md:grid-rows-[auto_1fr] md:p-14">
        <Reveal as="h2" className="md:col-start-1 md:row-start-1 max-w-[12ch] text-balance text-[clamp(1.875rem,8.5vw,2.75rem)] font-semibold leading-[1.02] tracking-[-0.03em] md:text-head">
          {about.heading}
        </Reveal>

        <div className="mt-10 flex flex-col gap-10 md:col-start-2 md:row-span-2 md:row-start-1 md:mt-0 md:w-[min(340px,100%)] md:gap-16">
          {about.blocks.map((b, i) => (
            <div key={b.title}>
              <Reveal as="h3" delay={0.075 * (1 + i * 2)} className="text-lead font-medium">
                {b.title}
              </Reveal>
              <Reveal as="p" delay={0.075 * (2 + i * 2)} className="mt-3 text-body text-muted [text-wrap:pretty]">
                {b.text}
              </Reveal>
            </div>
          ))}
          <Reveal delay={0.075 * 5}>
            <VectorButton href={about.cta.href}>{about.cta.label}</VectorButton>
          </Reveal>
        </div>

        {/* Masca fixă pe exterior, shutter-ul pe interior (wrapper dublu). */}
        <div
          ref={photo}
          className="relative mx-auto mt-12 w-full md:col-start-1 md:row-start-2 md:mx-0 md:mt-16 md:w-[min(38vw,100%)] md:self-start"
        >
          <VectorMask className="aspect-[16/10] w-full overflow-hidden">
            <motion.div
              className="size-full"
              initial={false}
              animate={{ clipPath: open || reduce ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
              transition={{ duration: reduce ? 0 : dur.shutter, ease: INOUT }}
            >
              <motion.div
                className="size-full"
                initial={false}
                animate={{ scale: open || reduce ? 1 : 1.12 }}
                transition={{ duration: reduce ? 0 : dur.imageSettle, ease: SOFT }}
              >
                <video
                  className="size-full scale-[1.1] object-cover grayscale contrast-[1.08]"
                  src={about.video.src}
                  poster={about.video.poster}
                  muted
                  loop
                  playsInline
                  autoPlay={!reduce}
                  preload="metadata"
                  onLoadedMetadata={(e) => {
                    e.currentTarget.currentTime = loopFrom;
                  }}
                  onTimeUpdate={(e) => {
                    // Buclă pe un segment scurt, fără cartonul de titlu din clipul original.
                    if (e.currentTarget.currentTime > loopTo) e.currentTarget.currentTime = loopFrom;
                  }}
                  aria-label={about.video.alt}
                />
              </motion.div>
            </motion.div>
          </VectorMask>
        </div>
      </div>
    </section>
  );
}
