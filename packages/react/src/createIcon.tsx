import { forwardRef, type SVGProps } from 'react';

export type IconVariant = 'light' | 'regular' | 'bold' | 'duotone' | 'fill';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref' | 'color'> {
  /** Style variant. Default `regular`. */
  variant?: IconVariant;
  /** Rendered size in px (square). Default 24. */
  size?: number | string;
  /** Any CSS colour. Default `currentColor` (inherits text colour). Duotone tint derives from it. */
  color?: string;
  /** Override stroke width (in 24-unit grid space). By default it's set per variant and optically adjusted for the size. */
  strokeWidth?: number;
  /** Accessible label. When omitted the icon is aria-hidden. */
  title?: string;
}

const BASE: Record<IconVariant, number | null> = { light: 0.75, regular: 1, bold: 1.5, duotone: 1, fill: null };
const OPTICAL: Record<number, number> = { 16: 1.25, 20: 1.1, 24: 1, 32: 0.875 };

/** Stroke multiplier so lines read the same weight at every size (mirrors tokens.icon.opticalStroke). */
export function opticalStroke(size: number): number {
  return OPTICAL[size] ?? Math.min(1.5, Math.max(0.75, Math.pow(24 / size, 0.55)));
}

export function createIcon(name: string, bodies: Partial<Record<IconVariant, string>>) {
  const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
    { variant = 'regular', size = 24, color = 'currentColor', strokeWidth, title, style, ...rest },
    ref
  ) {
    const body = bodies[variant] ?? bodies.regular ?? '';
    const base = BASE[variant];
    const px = typeof size === 'number' ? size : parseFloat(size) || 24;
    const sw = strokeWidth ?? (base == null ? undefined : +(base * opticalStroke(px)).toFixed(3));
    const a11y = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true as const };
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        strokeWidth={sw}
        style={{ color, ...style }}
        data-icon={name}
        {...a11y}
        {...rest}
        dangerouslySetInnerHTML={{ __html: (title ? `<title>${escape(title)}</title>` : '') + body }}
      />
    );
  });
  Icon.displayName = `Icon(${name})`;
  return Icon;
}

const escape = (s: string) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
