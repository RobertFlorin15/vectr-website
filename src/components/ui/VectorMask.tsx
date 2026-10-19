import { useRef, type CSSProperties, type ReactNode } from 'react';
import { useElementHeight } from '../../hooks/useElementHeight';
import { vectorClip } from '../../lib/vectorClip';

interface Props {
  dir?: 'right' | 'left' | 'up' | 'down';
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/** Wrapper with the vector-cut mask: the tip is always 90°, whatever the proportions. */
export default function VectorMask({ dir = 'right', className, style, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const h = useElementHeight(ref);
  return (
    <div ref={ref} className={className} style={{ ...style, clipPath: h ? vectorClip(h, dir) : undefined }}>
      {children}
    </div>
  );
}
