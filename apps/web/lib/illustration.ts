// Renders illustration templates ({{primary}} {{secondary}} {{background}} {{ink}}) for display
// and export. On the site they show in black on light and white on dark; colours are a
// recolour-before-download option.
import { animateSvg } from '@library/build/src/motion.mjs';
import { mix } from './colour';
import { fillIllustration, type Illustration, type IllustrationType, type MotionSpec } from './data';

export type IllTheme = 'light' | 'dark';
export type IllBackground = 'transparent' | 'grey' | 'white' | 'tint';
export type IllMotion = 'still' | 'draw' | 'float';

export const THEME_BG: Record<IllTheme, string> = { light: '#FFFFFF', dark: '#141416' };
export const THEME_INK: Record<IllTheme, string> = { light: '#141416', dark: '#F4F4F5' };
export const BACKGROUNDS: Record<IllBackground, Record<IllTheme, string> | null> = {
  transparent: null,
  grey: { light: '#E9E9EB', dark: '#323236' },
  white: { light: '#FFFFFF', dark: '#141416' },
  tint: { light: '#EEF1FF', dark: '#0F163D' },
};

export type IllRender = {
  type: IllustrationType;
  theme: IllTheme;
  /** null = mono ink for the theme */
  colour: string | null;
  /** 0–1: strength of filled faces (Fill slider) */
  fill?: number;
  background?: IllBackground;
  motion?: IllMotion;
  size?: number;
};

export function illustrationSvg(item: Illustration, o: IllRender) {
  const template = item.types[o.type] ?? item.types.stroke ?? Object.values(item.types)[0] ?? '';
  const bg = THEME_BG[o.theme];
  const ink = o.colour ?? THEME_INK[o.theme];
  const fill = o.fill ?? 1;
  const colours = {
    ink,
    background: bg,
    primary: mix(bg, ink, fill),
    secondary: mix(bg, ink, 0.35 * fill),
  };
  let svg = fillIllustration(template, colours);

  // Card background: the first <rect> is the 260×260 card.
  const card = o.background ? BACKGROUNDS[o.background] : { light: bg, dark: bg };
  svg = svg.replace(/<rect([^>]*?)fill="[^"]*"([^>]*)\/>/, (m, a, b) =>
    card ? `<rect${a}fill="${card[o.theme]}"${b}/>` : '',
  );
  // Stroke type: faces hide the lines behind them; the Fill slider fades them.
  if (o.type === 'stroke' && fill < 1) {
    svg = svg.replace(new RegExp(`(<path[^>]*?)fill="${bg}"`, 'g'), `$1fill="${bg}" fill-opacity="${+fill.toFixed(2)}"`);
  }
  if (o.size) svg = svg.replace(/<svg([^>]*?)width="\d+" height="\d+"/, `<svg$1width="${o.size}" height="${o.size}"`);

  if (o.motion === 'float' && item.motion) return animateSvg(svg, item.motion as MotionSpec);
  if (o.motion === 'draw') return drawOn(svg);
  return svg;
}

/** "Draw" motion: every stroked path traces itself in, holds, and repeats (3.2 s). */
function drawOn(svg: string) {
  let i = 0;
  const out = svg.replace(/<path\b(?=[^>]*stroke="(?!none))/g, () => `<path pathLength="1" class="d" style="--i:${i++}"`);
  const css =
    '@keyframes d{0%{stroke-dashoffset:1}45%,90%{stroke-dashoffset:0}100%{stroke-dashoffset:0}}' +
    '.d{stroke-dasharray:1 1;animation:d 3.2s cubic-bezier(.45,0,.2,1) infinite both;animation-delay:calc(var(--i)*12ms)}' +
    '@media (prefers-reduced-motion:reduce){.d{animation:none;stroke-dasharray:none}}';
  return out.replace(/<svg([^>]*)>/, `<svg$1><style>${css}</style>`);
}
