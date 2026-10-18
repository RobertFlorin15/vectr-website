import { CHEVRON_ANGLE, LOGO_RAYS } from '../../lib/logo';

interface Props {
  className?: string;
  /** Marginea (în unități de L_max) din jurul semnului, în viewBox. */
  pad?: number;
}

const rad = (d: number) => (d * Math.PI) / 180;

/** Semnul VECTR: 22 de raze dintr-o origine, reconstruit parametric din LOGO_RAYS. Origine = (0, 0), y în sus. */
export default function BurstMark({ className, pad = 0.08 }: Props) {
  const half = 1 + pad;
  return (
    <svg
      className={className}
      viewBox={`${-half} ${-half} ${half * 2} ${half * 2}`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {LOGO_RAYS.map(({ theta, L, w, arm }) => {
        const a = rad(theta);
        const tx = L * Math.cos(a);
        const ty = -L * Math.sin(a);
        // Brațele chevronului pleacă înapoi din vârf, la ±CHEVRON_ANGLE față de ax.
        const back = (s: 1 | -1) => {
          const b = a + Math.PI + s * rad(CHEVRON_ANGLE);
          return `${tx + arm * Math.cos(b)},${ty - arm * Math.sin(b)}`;
        };
        return (
          <g key={theta} strokeWidth={w}>
            <line x1={0} y1={0} x2={tx} y2={ty} />
            <polyline points={`${back(1)} ${tx},${ty} ${back(-1)}`} />
          </g>
        );
      })}
    </svg>
  );
}
