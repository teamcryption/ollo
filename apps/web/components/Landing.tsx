'use client';
// Landing page, built from Figma landing v1 (file NqyRMhIekr7P5eCV0kvX4m, "Desktop · Landing · Light"
// 149:9888 and "iPhone 14 · Landing · Light" 156:11302) as tweaked by Abdur. Every visual uses the
// real library: icons in each style, illustrations, motion and live figures. Counts come from the data.
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { initials, PRO_BATCHES, useAccount, type Plan } from '@/lib/account';
import {
  animatedIconSvg,
  exportIconSvg,
  fmt,
  loadMotion,
  svgDataUrl,
  type Category,
  type IconStyle,
  type Illustration,
  type IllustrationType,
  type Index,
  type MotionSpec,
} from '@/lib/data';
import type { Theme } from '@/lib/hooks';
import { illustrationSvg } from '@/lib/illustration';
import { LibIcon, useLibraryIcons } from '@/lib/libraryIcons';
import { BrandMark, type BrandId } from './BrandMarks';
import { FigmaMark } from './Account';
import { LiveIllustration } from './LiveIllustration';
import { Logo } from './Logo';
import { PricingBlock, type PlanAction } from './Pricing';
import { copyText } from './shared';
import { UiIcon, type UiIconName } from './ui-icons';

type Props = {
  theme: Theme;
  toggleTheme: () => void;
  index: Index | null;
  illustrations: Illustration[] | null;
  industries: Category[];
  onSearch: (q: string, mode: 'icons' | 'illustrations' | 'animated') => void;
  onToast: (t: string) => void;
};

const STYLES: [IconStyle, string][] = [
  ['light', 'Light'],
  ['regular', 'Regular'],
  ['bold', 'Bold'],
  ['fill', 'Fill'],
  ['duotone', 'Duotone'],
];
const SHOW = ['home', 'user', 'bell', 'search', 'heart', 'mail', 'lock', 'folder', 'calendar', 'chat'];
const PRO_STYLE = new Set<IconStyle>(['bold', 'fill', 'duotone']);

const hash = (h: string) => (location.hash = h);

export function Landing(p: Props) {
  const a = useAccount();
  const icons = p.index?.total ?? 78000;
  const ills = p.illustrations?.length ?? 1000;
  const latest = p.index?.latest ?? 0;
  const latestCount = useMemo(() => (p.index ? p.index.icons.filter((i) => i.b === latest).length : 0), [p.index, latest]);
  const allSvgs = useLibraryIcons(SHOW.flatMap((n) => STYLES.map(([s]) => [n, s] as [string, IconStyle])));
  const plan = (id: Plan): PlanAction =>
    id === 'free'
      ? { onClick: () => hash('library'), current: a?.plan === 'free' }
      : {
          onClick: () => hash(a ? `checkout?plan=${id}` : 'signup'),
          current: a?.plan === id || (id === 'pro' && a?.plan === 'lifetime'),
        };

  return (
    <div className="landing">
      <a className="lp-bar" href="#library">
        {latest > 0 && <span className="badge-new">BATCH {latest}</span>}
        <span>
          {latestCount ? `${fmt(latestCount)} new icons this week. ` : ''}
          {fmt(icons)} icons and {fmt(ills)} illustrations in the library now.
        </span>
        <span className="lp-bar-link">
          See what’s new <UiIcon name="chevron-right" size={16} />
        </span>
      </a>

      <nav className="lp-nav" aria-label="Main">
        <a href="#home" className="logo-link" aria-label="ollo home">
          <Logo />
        </a>
        <div className="lp-links only-desktop">
          {[
            ['Icons', 'library'],
            ['Illustrations', 'library?mode=illustrations'],
            ['Animated', 'library?mode=animated'],
            ['Figma plugin', 'figma'],
            ['Developers', 'docs'],
            ['Pricing', 'subscribe'],
            ['Changelog', 'library'],
          ].map(([l, h]) => (
            <a key={l} className="btn btn-ghost btn-sm" href={`#${h}`}>
              {l}
            </a>
          ))}
        </div>
        <div className="lp-actions">
          <button className="icon-btn" onClick={p.toggleTheme} aria-label={p.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            <UiIcon name={p.theme === 'dark' ? 'sun' : 'moon'} size={20} />
          </button>
          {a ? (
            <a className="avatar header-avatar" href="#account" aria-label={`Account: ${a.name}`}>
              {initials(a.name)}
            </a>
          ) : (
            <a className="btn btn-ghost btn-md only-wide" href="#signin">
              Sign in
            </a>
          )}
          <a className="btn btn-primary btn-md" href="#library">
            <UiIcon name="arrow-up-right" size={18} />
            <span className="only-wide">Browse library</span>
            <span className="only-phone">Browse</span>
          </a>
        </div>
      </nav>

      <Hero icons={icons} ills={ills} onSearch={p.onSearch} />
      <Showcase svgs={allSvgs} theme={p.theme} illustrations={p.illustrations} icons={icons} ills={ills} onToast={p.onToast} />

      <section className="lp-stats" aria-label="The library in numbers">
        {[
          [fmt(icons), 'icons, drawn from scratch'],
          [fmt(ills), 'isometric illustrations'],
          ['5', 'icon styles, one system'],
          ['3', 'illustration types'],
          ['Weekly', 'new batches, free updates'],
        ].map(([n, l]) => (
          <div key={l}>
            <b>{n}</b>
            <span>{l}</span>
          </div>
        ))}
      </section>

      <section className="lp-works" aria-label="Works with">
        <span className="eyebrow is-muted">WORKS WITH</span>
        {(
          [
            [['figma'], 'Figma'],
            [['react'], 'React'],
            [['html', 'svg'], 'HTML and SVG'],
            [['lottie'], 'Lottie'],
            [['framer'], 'Framer'],
            [['webflow'], 'Webflow'],
            [['notion'], 'Notion'],
            [['keynote'], 'Keynote'],
          ] as [BrandId[], string][]
        ).map(([marks, l]) => (
          <span key={l} className="lp-pill">
            {marks.map((m) => (
              <BrandMark key={m} id={m} />
            ))}
            {l}
          </span>
        ))}
      </section>

      <IconsSection svgs={allSvgs} icons={icons} />
      <IllustrationsSection illustrations={p.illustrations} industries={p.industries} theme={p.theme} ills={ills} />
      <MotionSection svgs={allSvgs} illustrations={p.illustrations} />
      <PluginSection svgs={allSvgs} icons={icons} />
      <DevelopersSection svgs={allSvgs} />
      <HowSection icons={icons} ills={ills} />

      <div className="lp-section is-surface">
        <PricingBlock id="pricing" actions={{ free: plan('free'), pro: plan('pro'), lifetime: plan('lifetime') }} />
      </div>

      <Faq />

      <section className="lp-section lp-final">
        <div className="lp-final-card">
          <div className="lp-final-icons" aria-hidden="true">
            {(
              [
                ['home', 'light'],
                ['bell', 'regular'],
                ['heart', 'fill'],
                ['folder', 'bold'],
                ['chat', 'duotone'],
              ] as [string, IconStyle][]
            ).map(([n, s]) => (
              <span key={n} className={n === 'heart' ? 'is-brand' : undefined}>
                <LibIcon svg={allSvgs[`${n}:${s}`]} />
              </span>
            ))}
          </div>
          <h2>Ship screens that look finished.</h2>
          <p>Start with every icon in Light and Regular, free forever. Upgrade for motion, every style and every illustration type.</p>
          <div className="lp-ctas">
            <a className="btn btn-primary btn-lg" href="#library">
              <UiIcon name="arrow-up-right" size={18} />
              Browse the library
            </a>
            <a className="btn btn-outline btn-lg" href="#pricing" onClick={(e) => (e.preventDefault(), document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }))}>
              See pricing
            </a>
          </div>
          <Ticks items={['Commercial licence', 'Pay once, keep it forever', 'New batches every week']} />
        </div>
      </section>

      <footer className="lp-footer">
        <div className="lp-footer-cols">
          <div className="lp-footer-brand">
            <Logo />
            <p>Hand-drawn icons and isometric illustrations, still, animated and live. For Figma, code and every screen in between.</p>
          </div>
          {[
            ['PRODUCT', [['Icons', 'library'], ['Illustrations', 'library?mode=illustrations'], ['Animated icons', 'library?mode=animated'], ['Figma plugin', 'figma'], ['Pricing', 'subscribe'], ['Changelog', 'library']]],
            ['DEVELOPERS', [['Docs', 'docs'], ['React', 'docs'], ['SVG and CDN', 'docs'], ['Licence', 'licence']]],
            ['COMPANY', [['About', 'about'], ['Contact', 'contact'], ['Affiliates', 'affiliates'], ['Blog', 'blog']]],
            ['LEGAL', [['Terms', 'terms'], ['Privacy', 'privacy'], ['Refund policy', 'refunds'], ['Licence', 'licence']]],
          ].map(([h, items]) => (
            <div key={h as string} className="lp-footer-col">
              <span>{h as string}</span>
              {(items as string[][]).map(([l, href]) => (
                <a key={l} href={`#${href}`}>
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="lp-footer-bottom">
          <span>© {new Date().getFullYear()} ollo. Every asset drawn from scratch.</span>
          <button className="lp-theme" onClick={p.toggleTheme}>
            <UiIcon name={p.theme === 'dark' ? 'moon' : 'sun'} size={16} />
            {p.theme === 'dark' ? 'Dark' : 'Light'}
          </button>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ pieces */

const Ticks = ({ items }: { items: string[] }) => (
  <ul className="lp-ticks" role="list">
    {items.map((t) => (
      <li key={t}>
        <UiIcon name="check" size={16} strokeWidth={2} />
        {t}
      </li>
    ))}
  </ul>
);

function Head({ eyebrow, title, sub, center }: { eyebrow: string; title: string; sub?: ReactNode; center?: boolean }) {
  return (
    <div className={`lp-head${center ? ' is-center' : ''}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </div>
  );
}

function Points({ items }: { items: [string, string][] }) {
  return (
    <ul className="lp-points" role="list">
      {items.map(([t, d]) => (
        <li key={t}>
          <span className="lp-check" aria-hidden="true">
            <UiIcon name="check" size={16} strokeWidth={2} />
          </span>
          <span>
            <b>{t}</b>
            {d}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Hero({ icons, ills, onSearch }: { icons: number; ills: number; onSearch: Props['onSearch'] }) {
  const [q, setQ] = useState('');
  const [mode, setMode] = useState<'icons' | 'illustrations' | 'animated'>('icons');
  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    onSearch(q.trim(), mode);
  };
  return (
    <section className="lp-hero">
      <a className="lp-pill-new" href="#library?mode=illustrations">
        <span className="badge-new">NEW</span>
        Live illustrations that follow the pointer and play as you scroll
        <UiIcon name="chevron-right" size={16} />
      </a>
      <h1>Every icon and illustration your product needs.</h1>
      <p className="lp-sub">
        {fmt(Math.floor(icons / 1000) * 1000)}+ icons in five styles and {fmt(ills)} isometric illustrations, still, animated or
        interactive. One hand-drawn system, ready for Figma, React and your AI builder.
      </p>
      <form className="lp-search" onSubmit={submit} role="search">
        <label className="search search-tablet">
          <UiIcon name="search" size={20} />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search icons and illustrations, e.g. empty inbox"
            aria-label="Search the library"
          />
          <kbd>/</kbd>
        </label>
        <div className="mode-switch" role="radiogroup" aria-label="Search in">
          {(
            [
              ['icons', 'Icons', 'grid'],
              ['illustrations', 'Illustrations', 'image'],
              ['animated', 'Animated', 'play'],
            ] as const
          ).map(([id, l, ic]) => (
            <button key={id} type="button" role="radio" aria-checked={mode === id} aria-selected={mode === id} className="seg seg-md" onClick={() => setMode(id)}>
              <UiIcon name={ic} size={16} />
              {l}
            </button>
          ))}
        </div>
      </form>
      <div className="lp-try">
        <span>Try</span>
        {['home', 'payment', 'empty state', 'onboarding', 'analytics', 'notification', 'dark mode'].map((t) => (
          <button key={t} className="chip" onClick={() => onSearch(t, mode)}>
            {t}
          </button>
        ))}
      </div>
      <div className="lp-ctas">
        <a className="btn btn-primary btn-lg" href="#library">
          <UiIcon name="arrow-up-right" size={18} />
          Browse {fmt(Math.floor(icons / 1000) * 1000)}+ free icons
        </a>
        <a className="btn btn-outline btn-lg" href="#pricing" onClick={(e) => (e.preventDefault(), document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }))}>
          See plans · pay once from $49
        </a>
      </div>
      <Ticks items={['Light and Regular free forever', 'Commercial licence', '14-day refund']} />
    </section>
  );
}

function useMotion() {
  const [m, setM] = useState<Record<string, MotionSpec> | null>(null);
  useEffect(() => {
    loadMotion().then(setM);
  }, []);
  return m;
}

function Animated({ svg, spec, size = 40, colour = '#171729' }: { svg?: string; spec?: MotionSpec; size?: number; colour?: string }) {
  if (!svg) return <span className="lib-icon" style={{ width: size, height: size }} />;
  // eslint-disable-next-line @next/next/no-img-element
  if (spec) return <img src={svgDataUrl(animatedIconSvg(svg, spec, colour, size))} width={size} height={size} alt="" className="lp-anim" />;
  return <LibIcon svg={svg} />;
}

/** Illustration shown in the page theme; picks one that has the asked type. */
function useShowcaseIllustrations(list: Illustration[] | null, n: number) {
  return useMemo(() => {
    if (!list?.length) return [] as Illustration[];
    const seen = new Set<string>();
    const out: Illustration[] = [];
    for (const it of list) {
      if (seen.has(it.c)) continue;
      seen.add(it.c);
      out.push(it);
      if (out.length >= n) break;
    }
    return out;
  }, [list, n]);
}

function IllView({ item, type, theme, className }: { item?: Illustration; type: IllustrationType; theme: Theme; className?: string }) {
  const svg = useMemo(() => (item ? illustrationSvg(item, { type, theme, colour: null, background: 'transparent' }) : ''), [item, type, theme]);
  return <span className={`lp-ill${className ? ' ' + className : ''}`} dangerouslySetInnerHTML={{ __html: svg }} />;
}

function Showcase({
  svgs,
  theme,
  illustrations,
  icons,
  ills,
  onToast,
}: {
  svgs: Record<string, string>;
  theme: Theme;
  illustrations: Illustration[] | null;
  icons: number;
  ills: number;
  onToast: (t: string) => void;
}) {
  const [style, setStyle] = useState<IconStyle>('regular');
  const [size, setSize] = useState(24);
  const [copied, setCopied] = useState<string | null>('lock');
  const [type, setType] = useState<IllustrationType>('stroke');
  const motion = useMotion();
  const [ill] = useShowcaseIllustrations(illustrations, 1);
  const copy = async (n: string) => {
    const svg = svgs[`${n}:${style}`];
    if (!svg) return;
    const ok = await copyText(exportIconSvg(svg, size, '#171729', {}, n));
    setCopied(n);
    onToast(ok ? 'SVG copied to clipboard' : 'Copy failed: clipboard is blocked in this browser');
  };
  return (
    <section className="lp-showcase" aria-label="What’s in ollo">
      <div className="lp-bento">
        <div className="lp-card lp-icons-card">
          <div className="lp-card-head">
            <span>
              <b>Icons</b>
              {fmt(icons)} icons · one 24 px grid · five styles
            </span>
            <div className="segmented" role="radiogroup" aria-label="Style">
              {STYLES.map(([id, l]) => (
                <button key={id} role="radio" aria-checked={style === id} aria-selected={style === id} className="seg seg-sm" onClick={() => setStyle(id)}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="lp-icon-grid">
            {SHOW.map((n) => (
              <button key={n} className={`lp-tile${copied === n ? ' is-copied' : ''}`} onClick={() => copy(n)} aria-label={`Copy ${n} SVG`} style={{ ['--px' as string]: `${size + 8}px` }}>
                <LibIcon svg={svgs[`${n}:${style}`]} />
                {copied === n && (
                  <span className="tile-check" aria-hidden="true">
                    <UiIcon name="check" size={14} strokeWidth={2} />
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="lp-card-foot">
            <span>Click to copy SVG, JSX or paste straight into Figma. Recolour and resize before you copy.</span>
            <div className="segmented" role="radiogroup" aria-label="Size">
              {[16, 20, 24, 32].map((s) => (
                <button key={s} role="radio" aria-checked={size === s} aria-selected={size === s} className="seg seg-sm" onClick={() => setSize(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lp-card lp-ill-card">
          <div className="lp-card-head">
            <span>
              <b>Illustrations</b>
              {fmt(ills)} isometric scenes, still, animated or live
            </span>
          </div>
          <div className="chip-group" role="radiogroup" aria-label="Type">
            {(['stroke', 'fill', 'duotone'] as IllustrationType[]).map((t) => (
              <button key={t} role="radio" aria-checked={type === t} className="chip" onClick={() => setType(t)}>
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="lp-ill-stage">
            <IllView item={ill} type={type} theme={theme} />
          </div>
        </div>

        <div className="lp-card lp-anim-card">
          <div className="lp-card-head">
            <span>
              <b>Animated icons</b>
              Pop-in, draw-on, wiggle and pulse on every icon
            </span>
          </div>
          <div className="lp-anim-row">
            {['bell', 'heart', 'search'].map((n) => (
              <span key={n} className="lp-tile is-static">
                <Animated svg={svgs[`${n}:regular`]} spec={motion?.[n]} size={36} colour={theme === 'dark' ? '#F4F4F5' : '#171729'} />
              </span>
            ))}
          </div>
          <div className="lp-formats">
            <span>Export</span>
            {['LOTTIE', '.LOTTIE', 'GIF', 'SVG'].map((f) => (
              <span key={f} className="badge-neutral">
                {f}
              </span>
            ))}
          </div>
        </div>

        <div className="lp-card lp-figma-card">
          <div className="lp-figma-text">
            <span className="icon-chip">
              <FigmaMark />
            </span>
            <b>Figma plugin</b>
            <p>Insert any icon as a real component with every style as a variant.</p>
            <a className="btn btn-outline btn-sm" href="#figma">
              <FigmaMark size={16} />
              Get the plugin
            </a>
          </div>
          <div className="lp-figma-canvas" aria-hidden="true">
            <div className="lp-set">
              <span className="lp-set-name">❖ home</span>
              <div className="lp-set-box">
                {STYLES.map(([s, l]) => (
                  <span key={s}>
                    <LibIcon svg={svgs[`home:${s}`]} />
                    {l}
                  </span>
                ))}
              </div>
            </div>
            <div className="lp-props">
              <b>home</b>
              <span>Style</span>
              <span className="lp-fake-select">
                Regular <UiIcon name="chevron-down" size={14} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function IconsSection({ svgs, icons }: { svgs: Record<string, string>; icons: number }) {
  return (
    <section className="lp-section lp-split">
      <div className="lp-copy">
        <Head
          eyebrow="ICONS"
          title="One icon, five styles, every size."
          sub="Soft, continuous strokes with one small floating accent. Every icon is drawn on the same 24 px grid, so a screen full of them looks like one family."
        />
        <Points
          items={[
            ['Light, Regular, Bold, Fill and Duotone', 'Switch style without switching icon. Light and Regular are free.'],
            ['Optical stroke at every size', '16, 20, 24 and 32 px each get their own stroke weight, never a scaled one.'],
            ['One colour, every shade', 'Recolour once. Duotone tints follow the same colour automatically.'],
          ]}
        />
        <a className="btn btn-outline btn-lg" href="#library">
          <UiIcon name="arrow-up-right" size={18} />
          Browse all {fmt(icons)} icons
        </a>
      </div>
      <div className="lp-card lp-matrix">
        <div className="lp-matrix-row is-head">
          {STYLES.map(([s, l]) => (
            <span key={s}>
              {l}
              {PRO_STYLE.has(s) && <span className="badge-pro">PRO</span>}
            </span>
          ))}
        </div>
        {['home', 'bell', 'heart', 'calendar', 'chat'].map((n) => (
          <div key={n} className="lp-matrix-row">
            {STYLES.map(([s]) => (
              <span key={s}>
                <LibIcon svg={svgs[`${n}:${s}`]} />
              </span>
            ))}
          </div>
        ))}
        <div className="lp-sizes">
          {[16, 20, 24, 32, 48].map((px) => (
            <span key={px}>
              <span className="lp-size-icon" style={{ width: px, height: px }}>
                <LibIcon svg={svgs['search:regular']} />
              </span>
              <code>{px} px</code>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function IllustrationsSection({ illustrations, industries, theme, ills }: { illustrations: Illustration[] | null; industries: Category[]; theme: Theme; ills: number }) {
  const picks = useShowcaseIllustrations(illustrations, 6).slice(1, 5);
  const types: [IllustrationType | 'animated', string][] = [
    ['stroke', 'STROKE'],
    ['fill', 'FILL'],
    ['duotone', 'DUOTONE'],
    ['animated', 'STROKE'],
  ];
  return (
    <section className="lp-section is-surface">
      <Head
        center
        eyebrow="ILLUSTRATIONS"
        title="Isometric scenes that explain your product."
        sub={`${fmt(ills)} hand-built scenes for empty states, onboarding, pricing and heroes. Stroke, Fill or Duotone, in your brand colour, light or dark.`}
      />
      <div className="lp-ill-cards">
        {picks.map((it, i) => (
          <a key={it.n} className="lp-ill-item" href="#library?mode=illustrations">
            <span className="lp-ill-frame">
              {types[i][0] === 'animated' && it.live ? (
                <LiveIllustration name={it.n} mode="animated" style="stroke" theme={theme} colour={null} tags={false} />
              ) : (
                <IllView item={it} type={types[i][0] === 'animated' ? 'stroke' : (types[i][0] as IllustrationType)} theme={theme} />
              )}
              {types[i][0] === 'animated' && <span className="badge-new lp-ill-tag">ANIMATED</span>}
            </span>
            <span className="lp-ill-meta">
              <b>{it.t}</b>
              <span className="badge-neutral">{types[i][1]}</span>
            </span>
          </a>
        ))}
      </div>
      <div className="lp-industries">
        {[...industries].sort((x, y) => y.count - x.count).slice(0, 16).map((c) => (
          <a key={c.id} className="chip" href="#library?mode=illustrations">
            {c.title}
          </a>
        ))}
      </div>
      <a className="btn btn-primary btn-lg" href="#library?mode=illustrations">
        <UiIcon name="arrow-up-right" size={18} />
        Browse {fmt(ills)} illustrations
      </a>
    </section>
  );
}

function MotionSection({ svgs, illustrations }: { svgs: Record<string, string>; illustrations: Illustration[] | null }) {
  const motion = useMotion();
  const live = useMemo(() => (illustrations ?? []).filter((i) => i.live), [illustrations]);
  const cards: [UiIconName, string, string, ReactNode, string | null][] = [
    [
      'play',
      'Animated icons',
      'Every icon can pop in, draw on, wiggle or pulse. Export Lottie, .lottie, GIF or animated SVG.',
      <div key="a" className="lp-motion-icons">
        {['bell', 'heart'].map((n) => (
          <span key={n} className="lp-tile is-static">
            <Animated svg={svgs[`${n}:regular`]} spec={motion?.[n]} size={40} colour="#F4F4F5" />
          </span>
        ))}
      </div>,
      null,
    ],
    [
      'sparkle',
      'Interactive illustrations',
      'Live figures that follow the pointer: a vault dial turns, a parcel lifts, a chart redraws.',
      live[2] ? <LiveIllustration key="i" name={live[2].n} mode="interactive" style="stroke" theme="dark" colour={null} tags={false} /> : null,
      'LIVE',
    ],
    [
      'layers',
      'Scroll illustrations',
      'Scenes that play as visitors scroll and rewind on the way up. Nothing pinned, nothing hijacked.',
      live[7] ? <LiveIllustration key="s" name={live[7].n} mode="scroll" style="stroke" theme="dark" colour={null} tags={false} /> : null,
      'SCROLL',
    ],
  ];
  return (
    <section className="lp-section lp-motion force-dark">
      <Head
        center
        eyebrow="MOTION"
        title="Icons that move. Illustrations that react."
        sub="Motion is built into the library, not added later. Hover, follow the pointer or scroll, with exports for every tool."
      />
      <div className="lp-motion-cards">
        {cards.map(([ic, t, d, visual, tag]) => (
          <div key={t} className="lp-motion-card">
            <div className="lp-motion-visual">
              {visual}
              {tag && <span className="badge-new lp-ill-tag">{tag}</span>}
            </div>
            <b>
              <UiIcon name={ic} size={20} />
              {t}
            </b>
            <p>{d}</p>
          </div>
        ))}
      </div>
      <a className="btn btn-outline btn-lg" href="#library?mode=animated">
        <UiIcon name="arrow-up-right" size={18} />
        See motion in the library
      </a>
    </section>
  );
}

function PluginSection({ svgs, icons }: { svgs: Record<string, string>; icons: number }) {
  return (
    <section className="lp-section lp-split is-reverse">
      <div className="lp-plugin" aria-hidden="true">
        <div className="lp-plugin-head">
          <FigmaMark />
          <b>ollo</b>
          <span className="badge-pro">PRO</span>
        </div>
        <div className="lp-plugin-body">
          <div className="lp-plugin-top">
            <span className="mode-switch">
              <span className="seg seg-sm" aria-selected="true">
                <UiIcon name="grid" size={14} />
                Icons
              </span>
              <span className="seg seg-sm">
                <UiIcon name="image" size={14} />
                Illustrations
              </span>
            </span>
            <span className="search">
              <UiIcon name="search" size={16} />
              <span>Search {fmt(icons)} icons</span>
            </span>
          </div>
          <div className="chip-group">
            {['Regular', 'Light', 'Bold', 'Fill', 'Duotone'].map((c, i) => (
              <span key={c} className="chip" aria-checked={i === 0} role="radio">
                {c}
              </span>
            ))}
          </div>
          <div className="lp-plugin-grid">
            {SHOW.map((n) => (
              <span key={n} className={`lp-tile is-static${n === 'bell' ? ' is-copied' : ''}`}>
                <LibIcon svg={svgs[`${n}:regular`]} />
              </span>
            ))}
          </div>
          <span className="toast lp-plugin-toast">
            <span className="toast-ok">
              <UiIcon name="check" size={16} strokeWidth={2} />
            </span>
            bell added to Figma as a component
          </span>
        </div>
      </div>
      <div className="lp-copy">
        <Head
          eyebrow="FIGMA PLUGIN"
          title="Drop components, not pictures."
          sub="The whole library inside Figma. Click an icon and it lands on your canvas as a component, named after the icon, with every style as a variant."
        />
        <Points
          items={[
            ['Every style is a variant', 'Swap Regular for Fill in the properties panel. No re-inserting.'],
            ['Named for search', 'Layers and components carry the icon name, so Assets search just works.'],
            ['Free styles without signing in', 'Sign in once with your browser to unlock Pro styles and illustrations.'],
          ]}
        />
        <div className="lp-inline">
          <a className="btn btn-primary btn-lg" href="#figma">
            <FigmaMark size={18} />
            Get the Figma plugin
          </a>
          <span>Free on Figma Community</span>
        </div>
      </div>
    </section>
  );
}

const CODE: [string, string][][] = [
  [
    ['$ ', 't'],
    ['npm i @ollo/react', 'p'],
  ],
  [],
  [
    ['import ', 't'],
    ['{ Home, Bell }', 'p'],
    [' from ', 't'],
    ["'@ollo/react'", 'b'],
  ],
  [],
  [
    ['export function ', 't'],
    ['Nav', 'p'],
    ['() {', 't'],
  ],
  [['  return (', 't']],
  [
    ['    <', 't'],
    ['Home ', 'p'],
    ['size', 't'],
    ['={24} />', 'p'],
  ],
  [
    ['    <', 't'],
    ['Bell ', 'p'],
    ['variant', 't'],
    ["='duotone' ", 'b'],
    ['color', 't'],
    ["='#3A57FF' />", 'b'],
  ],
  [['  )', 't']],
  [['}', 't']],
];

function DevelopersSection({ svgs }: { svgs: Record<string, string> }) {
  const [tab, setTab] = useState('React');
  return (
    <section className="lp-section lp-split is-surface">
      <div className="lp-copy">
        <Head
          eyebrow="DEVELOPERS"
          title="Ship icons as code in one line."
          sub="Copy JSX or SVG from any tile today. The React package brings tree-shaken components with size, colour and style props."
        />
        <Points
          items={[
            ['Copy JSX or SVG', 'Clean, optimised markup named after the icon.'],
            ['Size, colour and style props', 'One component, every style. Duotone follows your colour.'],
            ['SVG sprite and CDN', 'Drop-in for any stack, no build step.'],
          ]}
        />
        <a className="btn btn-outline btn-lg" href="#docs">
          <UiIcon name="arrow-up-right" size={18} />
          Read the docs
        </a>
      </div>
      <div className="lp-code force-dark">
        <div className="lp-code-tabs">
          {['React', 'SVG', 'CDN'].map((t) => (
            <button key={t} className={tab === t ? 'is-on' : undefined} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
          <span className="grow" />
          <span className="badge-new">REACT PACKAGE SOON</span>
        </div>
        <pre>
          {CODE.map((ln, i) => (
            <code key={i}>
              {ln.length ? ln.map(([s, c], j) => <span key={j} className={`c-${c}`}>{s}</span>) : ' '}
            </code>
          ))}
        </pre>
        <div className="lp-code-result">
          <span>RENDERS</span>
          <LibIcon svg={svgs['home:regular']} />
          <LibIcon svg={svgs['bell:duotone']} className="is-brand" />
        </div>
      </div>
    </section>
  );
}

function HowSection({ icons, ills }: { icons: number; ills: number }) {
  return (
    <section className="lp-section">
      <Head center eyebrow="HOW IT WORKS" title="From search to shipped in three clicks." />
      <div className="lp-steps">
        {(
          [
            ['01', 'search', 'Find', `Search ${fmt(icons)} icons and ${fmt(ills)} illustrations by name, tag or industry. Typos and plurals are fine.`],
            ['02', 'palette', 'Customise', 'Pick a style, colour and size, light or dark. Duotone tints follow your colour.'],
            ['03', 'download', 'Ship', 'Copy SVG or JSX, download PNG, Lottie, .lottie or GIF, or insert into Figma.'],
          ] as [string, UiIconName, string, string][]
        ).map(([n, ic, t, d]) => (
          <div key={n} className="lp-step">
            <div className="lp-step-head">
              <span className="icon-chip">
                <UiIcon name={ic} size={20} />
              </span>
              <code>{n}</code>
            </div>
            <b>{t}</b>
            <p>{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const QA: [string, string][] = [
  ['Can I use ollo in commercial projects?', 'Yes. Every plan includes a commercial licence for your own and client work. Free asks for a small attribution; Pro and Lifetime don’t.'],
  ['What’s free and what’s Pro?', 'Every icon in Light and Regular, some Stroke illustrations and the Figma plugin with Free styles are free forever. Pro adds Bold, Fill and Duotone, animation exports, every illustration type and Figma variants. Lifetime adds every future batch and up to 5 people.'],
  ['How often do new icons and illustrations arrive?', `A new batch ships every week. Pro includes the next ${PRO_BATCHES} batches; Lifetime includes every batch, forever.`],
  ['How does the Figma plugin work?', 'Search inside Figma and click to insert. Each asset becomes a component named after it, with its styles as variants.'],
  ['Is ollo a subscription? Can I get a refund?', 'No subscription: you pay once and keep everything you’ve unlocked. Not happy within 14 days and haven’t downloaded any files? We refund in full.'],
  ['Were these icons drawn from scratch?', 'Yes. Every icon and illustration is drawn by hand on our own grid. Nothing is traced or copied from another library.'],
];

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="lp-section lp-faq">
      <div className="lp-copy">
        <Head eyebrow="FAQ" title="Questions, answered." sub="Something else? Write to us and a real person replies within a day." />
        <a className="btn btn-outline btn-md" href="#contact">
          Contact support
        </a>
      </div>
      <div className="lp-faq-list">
        {QA.map(([q, ans], i) => (
          <div key={q} className={`lp-qa${open === i ? ' is-open' : ''}`}>
            <button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
              <span>{q}</span>
              <UiIcon name={open === i ? 'close' : 'plus'} size={20} />
            </button>
            {open === i && <p>{ans}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
