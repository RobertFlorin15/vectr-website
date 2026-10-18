import { useId, type FormEvent } from 'react';
import { CONTACT_EMAIL, join } from '../../content/site';
import Reveal from '../ui/Reveal';
import VectorButton from '../ui/VectorButton';

const field =
  'block h-[54px] w-full rounded-none border-0 bg-muted px-4 text-body text-void placeholder:text-surface2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-void md:h-[52px]';

/** Chevron decupat din marginea cuponului: vârf de 90°, în culoarea fundalului (SPEC §7.7). */
function Notch({ pos }: { pos: 'top' | 'bottom' }) {
  return (
    <span
      aria-hidden
      className={`absolute left-1/2 h-3.5 w-7 -translate-x-1/2 bg-void ${pos === 'top' ? 'top-0 [clip-path:polygon(0_0,100%_0,50%_100%)]' : 'bottom-0 [clip-path:polygon(50%_0,100%_100%,0_100%)]'}`}
    />
  );
}

/** Contact: formularul-cupon. Nu există backend, deci trimiterea deschide mailto: (SPEC §7.7). */
export default function Join() {
  const uid = useId();

  // [DE CONECTAT] Formspree / Google Forms înainte de lansare. Nu se simulează succesul unui server.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const division = String(d.get('division') ?? '');
    const subject = `Aplicație VECTR — ${division}`;
    const body = [
      `Nume: ${d.get('name')}`,
      `Email: ${d.get('email')}`,
      `Facultatea și anul: ${d.get('faculty')}`,
      `Divizia: ${division}`,
    ].join('\n');
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="contact" data-ink="light" className="bg-void px-3 py-[var(--section)] md:px-(--margin)">
      <Reveal className="relative mx-auto max-w-[1920px] md:w-[calc(100%/12*10)]">
        <div className="relative bg-ink text-void">
          <span className="hidden md:contents">
            <Notch pos="top" />
            <Notch pos="bottom" />
          </span>

          <form onSubmit={onSubmit} className="grid md:grid-cols-[46%_1fr] md:aspect-[2.2/1]">
            <div className="flex flex-col justify-between gap-10 p-6 pt-12 md:p-12">
              <h2 className="max-w-[12ch] text-balance text-head font-semibold tracking-[-0.03em]">{join.heading}</h2>
              <p className="max-w-[34ch] text-body [text-wrap:pretty]">{join.text}</p>
            </div>

            {/* Perforația: puncte între cele două crestături; pe telefon crestăturile sunt pe marginile laterale */}
            <div className="relative flex flex-col justify-center gap-2.5 border-t-[5px] border-dotted border-void p-6 pb-12 md:border-l-[5px] md:border-t-0 md:p-12 md:pl-10">
            <span aria-hidden className="absolute -left-px -top-[17px] h-7 w-3.5 bg-void [clip-path:polygon(0_0,100%_50%,0_100%)] md:hidden" />
            <span aria-hidden className="absolute -right-px -top-[17px] h-7 w-3.5 bg-void [clip-path:polygon(100%_0,0_50%,100%_100%)] md:hidden" />
              <label className="sr-only" htmlFor={`${uid}-n`}>{join.fields.name}</label>
              <input id={`${uid}-n`} name="name" required autoComplete="name" placeholder={join.fields.name} className={field} />
              <label className="sr-only" htmlFor={`${uid}-e`}>{join.fields.email}</label>
              <input id={`${uid}-e`} name="email" type="email" required autoComplete="email" placeholder={join.fields.email} className={field} />
              <label className="sr-only" htmlFor={`${uid}-f`}>{join.fields.faculty}</label>
              <input id={`${uid}-f`} name="faculty" required placeholder={join.fields.faculty} className={field} />
              <label className="sr-only" htmlFor={`${uid}-d`}>{join.fields.division}</label>
              <select id={`${uid}-d`} name="division" required defaultValue="" className={`${field} appearance-none`}>
                <option value="" disabled>
                  {join.fields.division}
                </option>
                {join.divisions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <VectorButton type="submit" tone="void" size="lg" className="vbtn--block mt-2">
                {join.submit}
              </VectorButton>
            </div>
          </form>
        </div>
        <p className="mt-6 text-body text-muted">{join.direct}</p>
      </Reveal>
    </section>
  );
}
