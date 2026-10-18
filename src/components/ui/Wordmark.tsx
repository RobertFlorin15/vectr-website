import wordmarkSvg from '../../../public/brand/vectr-wordmark.svg?raw';

const viewBox = /viewBox="([^"]+)"/.exec(wordmarkSvg)?.[1] ?? '0 0 480 136';
const pathD = /<path[^>]* d="([^"]+)"/.exec(wordmarkSvg)?.[1] ?? '';
const [, , vw, vh] = viewBox.split(' ').map(Number);

/** Wordmark VECTR vectorizat (potrace), moștenește `color`. Înălțimea e dată prin `height`. */
export default function Wordmark({ height = 22, className }: { height?: number; className?: string }) {
  return (
    <svg
      role="img"
      aria-label="VECTR"
      viewBox={viewBox}
      height={height}
      width={(height * vw) / vh}
      fill="currentColor"
      className={className}
    >
      <path fillRule="evenodd" d={pathD} />
    </svg>
  );
}
