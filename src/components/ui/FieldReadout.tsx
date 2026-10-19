import type { RefObject } from 'react';

/**
 * The field readout: the exact vector under the charge. Text is written through a ref (15 Hz), not state.
 * Components have a fixed sign and 2 decimals, so the tabular figures do not "dance".
 */
export default function FieldReadout({ valueRef }: { valueRef: RefObject<HTMLElement | null> }) {
  return (
    <output aria-label="Valoarea câmpului vectorial sub cursor" aria-live="off" className="block whitespace-pre-wrap text-muted">
      <var className="vec">v</var>
      <code ref={valueRef}> = (+0.00, +0.00, +0.00)   ‖v‖ = 0.00   θ = 0.0°</code>
    </output>
  );
}
