import { CHEVRON_ANGLE, LOGO_RAYS } from '../../lib/logo';

interface Props {
  className?: string;
  /** Margin (in L_max units) around the mark, inside the viewBox. */
  pad?: number;
}

const rad = (d: number) => (d * Math.PI) / 180;

/** The VECTR mark: 22 rays from one origin, rebuilt parametrically from LOGO_RAYS. Origin = (0, 0), y up. */
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
        // The chevron arms run back from the tip, at ±CHEVRON_ANGLE from the axis.
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
