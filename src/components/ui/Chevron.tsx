/** Bulina din liste: chevron deschis, linie 0.12em, capete rotunde, exact ca la „r” (SPEC §4.3). */
export default function Chevron({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 10 10"
      className={className}
      width="0.5em"
      height="0.5em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3,1 7.5,5 3,9" />
    </svg>
  );
}
