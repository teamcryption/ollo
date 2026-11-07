import { forwardRef, useMemo, type SVGProps } from 'react';

export type IllustrationType = 'stroke' | 'fill' | 'duotone';

export interface IllustrationProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  /** Default `duotone`. */
  type?: IllustrationType;
  primary?: string;
  secondary?: string;
  /** Card fill AND face-separation lines - always the same value by design. */
  background?: string;
  ink?: string;
  /** Width in px; height follows the 1:1 card. Default 260. */
  size?: number | string;
  title?: string;
}

export const ILLUSTRATION_DEFAULTS = {
  primary: '#6B54F5',
  secondary: '#AC9FFF',
  background: '#F7F7FF',
  ink: '#171729',
};

export function createIllustration(name: string, templates: Partial<Record<IllustrationType, string>>) {
  const Illustration = forwardRef<SVGSVGElement, IllustrationProps>(function Illustration(
    { type = 'duotone', primary, secondary, background, ink, size = 260, title, ...rest },
    ref
  ) {
    const colours = {
      primary: primary ?? ILLUSTRATION_DEFAULTS.primary,
      secondary: secondary ?? ILLUSTRATION_DEFAULTS.secondary,
      background: background ?? ILLUSTRATION_DEFAULTS.background,
      ink: ink ?? ILLUSTRATION_DEFAULTS.ink,
    };
    const tpl = templates[type] ?? templates.stroke ?? '';
    const html = useMemo(
      () => tpl.replace(/\{\{(\w+)\}\}/g, (m, k: keyof typeof colours) => colours[k] ?? m),
      [tpl, colours.primary, colours.secondary, colours.background, colours.ink]
    );
    const a11y = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true as const };
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 260 260"
        width={size}
        height={size}
        fill="none"
        data-illustration={name}
        {...a11y}
        {...rest}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  });
  Illustration.displayName = `Illustration(${name})`;
  return Illustration;
}
