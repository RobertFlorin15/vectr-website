import type { RefObject } from 'react';

/**
 * Afișajul câmpului: vectorul exact de sub sarcină. Textul se scrie prin ref (15 Hz), nu prin state.
 * Componentele au semn fix și 2 zecimale, deci cifrele tabulare nu „dansează”.
 */
export default function FieldReadout({ valueRef }: { valueRef: RefObject<HTMLElement | null> }) {
  return (
    <output aria-label="Valoarea câmpului vectorial sub cursor" aria-live="off" className="block whitespace-pre-wrap text-muted">
      <var className="vec">v</var>
      <code ref={valueRef}> = (+0.00, +0.00, +0.00)   ‖v‖ = 0.00   θ = 0.0°</code>
    </output>
  );
}
