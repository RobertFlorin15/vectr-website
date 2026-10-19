import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

interface Common {
  tone?: 'ink' | 'void';
  size?: 'md' | 'sm' | 'lg';
  children: ReactNode;
}

type AnchorProps = Common & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>;
type ButtonProps = Common & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

/** Vector-cut button: body + separate 90° tip that advances 8px on hover (SPEC §4.3, §8). */
export default function VectorButton(props: AnchorProps | ButtonProps) {
  const { tone = 'ink', size = 'md', children, className = '', ...rest } = props;
  const inner = (
    <>
      <span className="vbtn__tip" aria-hidden />
      <span className="vbtn__body">{children}</span>
    </>
  );
  const cls = `vbtn ${className}`.trim();
  if ('href' in rest && rest.href !== undefined) {
    return (
      <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} className={cls} data-tone={tone} data-size={size}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)} className={cls} data-tone={tone} data-size={size}>
      {inner}
    </button>
  );
}
