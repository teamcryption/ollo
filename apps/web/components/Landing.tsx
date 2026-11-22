'use client';
// Landing page, built from Figma landing v1 (file NqyRMhIekr7P5eCV0kvX4m, "Desktop · Landing · Light"
// 149:9888 and "iPhone 14 · Landing · Light" 156:11302) as tweaked by Abdur. Every visual uses the
// real library: icons in each style, illustrations, motion and live figures. Counts come from the data.
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { CountUp, Roll, useInView, useReveal, useSmoothScroll, Words } from '@/lib/motion';
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
import { usePhone, type Theme } from '@/lib/hooks';
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

  const root = useRef<HTMLDivElement>(null);
  useReveal(root, [p.index, p.illustrations, a]);
  useSmoothScroll();
  // Phones get the iPhone layout from Figma (156:11302): fewer, stacked sections.
  const phone = usePhone();
  const [menu, setMenu] = useState(false);

  return (
    <div className="landing" ref={root}>
      <a className="lp-bar" href="#library">
        {latest > 0 && <span className="badge-new">BATCH {latest}</span>}
        {phone ? (
          <span className="lp-bar-short">{latestCount ? `${fmt(latestCount)} new icons this week` : `${fmt(icons)} icons in the library`}</span>
        ) : (
          <span>
            {latestCount ? `${fmt(latestCount)} new icons this week. ` : ''}
            {fmt(icons)} icons and {fmt(ills)} illustrations in the library now.
          </span>
        )}
        <span className="lp-bar-link">
          {!phone && 'See what’s new '}
          <UiIcon name="chevron-right" size={16} />
        </span>
      </a>

      <nav className="lp-nav" aria-label="Main">
        <a href="#home" className="logo-link" aria-label="ollo home">
          <Logo />
        </a>
        <div className="lp-links only-desktop">
          {[
            ['Icons', 'icons'],
            ['Illustrations', 'illustrations'],
            ['Animated', 'animated'],
            ['Figma plugin', 'figma-plugin'],
            ['Developers', 'developers'],
            ['Pricing', 'pricing'],
            ['FAQ', 'faq'],
          ].map(([l, id]) => (
            <a key={l} className="btn btn-ghost btn-sm" href={`#home`} onClick={(e) => (e.preventDefault(), toSection(id))}>
              <Roll text={l} />
            </a>
          ))}
        </div>
        {phone ? (
          <div className="lp-actions">
            <a className="btn btn-primary btn-sm" href="#library">
              Browse
            </a>
            <button className="icon-btn" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
              <UiIcon name={menu ? 'close' : 'menu'} size={20} />
            </button>
          </div>
        ) : (
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
            <span className="only-wide">
              <Roll text="Browse library" />
            </span>
            <span className="only-phone">Browse</span>
          </a>
        </div>
        )}
      </nav>
      {phone && menu && (
        <div className="lp-menu" role="menu">
          {[
            ['Icons', 'icons'],
            ['Illustrations', 'illustrations'],
            ['Animated', 'animated'],
            ['Figma plugin', 'figma-plugin'],
            ['Pricing', 'pricing'],
            ['FAQ', 'faq'],
          ].map(([l, id]) => (
            <a key={id} role="menuitem" href="#home" onClick={(e) => (e.preventDefault(), setMenu(false), requestAnimationFrame(() => requestAnimationFrame(() => toSection(id))))}>
              {l}
              <UiIcon name="chevron-right" size={16} />
            </a>
          ))}
          <div className="lp-menu-foot">
            <button className="btn btn-outline btn-md" onClick={p.toggleTheme}>
              <UiIcon name={p.theme === 'dark' ? 'sun' : 'moon'} size={18} />
              {p.theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            {a ? (
              <a className="btn btn-primary btn-md" href="#account">
                Account
              </a>
            ) : (
              <a className="btn btn-primary btn-md" href="#signin">
                Sign in
              </a>
            )}
          </div>
        </div>
      )}

      <Hero icons={icons} ills={ills} onSearch={p.onSearch} phone={phone} />
      <Showcase phone={phone} svgs={allSvgs} theme={p.theme} illustrations={p.illustrations} icons={icons} ills={ills} onToast={p.onToast} />

      <section className="lp-stats" aria-label="The library in numbers">
        {(phone
          ? [
              [fmt(icons), 'icons'],
              [fmt(ills), 'illustrations'],
              ['5', 'icon styles'],
              ['Weekly', 'new batches'],
            ]
          : [
              [fmt(icons), 'icons, drawn from scratch'],
              [fmt(ills), 'isometric illustrations'],
              ['5', 'icon styles, one system'],
              ['3', 'illustration types'],
              ['Weekly', 'new batches, free updates'],
            ]
        ).map(([n, l], i) => (
          <div key={l} className="rv" data-reveal="" style={{ ['--i' as string]: i }}>
            <b>
              <CountUp value={n} />
            </b>
            <span>{l}</span>
          </div>
        ))}
      </section>

      {!phone && (
      <section className="lp-works" aria-label="Works with">
        <span className="lp-works-label">WORKS WITH</span>
        <div className="lp-marquee">
          <div className="lp-marquee-track">
        {[0, 1].map((copy) => (
          <span key={copy} className="lp-marquee-set" aria-hidden={copy === 1 || undefined}>
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
            <span className="lp-pill-marks">
              {marks.map((m) => (
                <BrandMark key={m} id={m} />
              ))}
            </span>
            {l}
          </span>
        ))}
          </span>
        ))}
          </div>
        </div>
      </section>
      )}

      <IconsSection phone={phone} svgs={allSvgs} icons={icons} />
      <IllustrationsSection phone={phone} illustrations={p.illustrations} industries={p.industries} theme={p.theme} ills={ills} />
      <MotionSection phone={phone} svgs={allSvgs} illustrations={p.illustrations} />
      <PluginSection phone={phone} svgs={allSvgs} icons={icons} />
      {!phone && <DevelopersSection svgs={allSvgs} />}
      {!phone && <HowSection icons={icons} ills={ills} />}

      <div className="lp-section is-surface">
        <PricingBlock id="pricing" actions={{ free: plan('free'), pro: plan('pro'), lifetime: plan('lifetime') }} />
      </div>

      <Faq phone={phone} />

      <section className="lp-section lp-final">
        <FinalCta theme={p.theme} phone={phone} />
      </section>

      {phone ? (
        <footer className="lp-footer lp-pfooter">
          <Logo />
          <p>Hand-drawn icons and isometric illustrations for Figma, code and every screen in between.</p>
          <div className="lp-pfooter-cols">
            {[
              ['PRODUCT', [['Icons', 'library'], ['Illustrations', 'library?mode=illustrations'], ['Figma plugin', 'figma'], ['Pricing', 'subscribe']]],
              ['COMPANY', [['About', 'about'], ['Contact', 'contact'], ['Terms', 'terms'], ['Privacy', 'privacy']]],
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
          <span className="lp-pfooter-copy">© {new Date().getFullYear()} ollo. Every asset drawn from scratch.</span>
        </footer>
      ) : (
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
      )}
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
      <span className="eyebrow rv" data-reveal="">
        {eyebrow}
      </span>
      <Words text={title} />
      {sub && (
        <p className="rv" data-reveal="" style={{ ['--i' as string]: 2 }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function Points({ items }: { items: [string, string][] }) {
  return (
    <ul className="lp-points" role="list">
      {items.map(([t, d], i) => (
        <li key={t} className="rv" data-reveal="" style={{ ['--i' as string]: i + 1 }}>
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

function Hero({ icons, ills, onSearch, phone }: { icons: number; ills: number; onSearch: Props['onSearch']; phone: boolean }) {
  const [q, setQ] = useState('');
  const [mode, setMode] = useState<'icons' | 'illustrations' | 'animated'>('icons');
  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    onSearch(q.trim(), mode);
  };
  return (
    <section className="lp-hero">
      <a className="lp-pill-new rv" data-reveal="" href="#library?mode=illustrations">
        <span className="badge-new">NEW</span>
        {phone ? 'Live illustrations' : 'Live illustrations that follow the pointer and play as you scroll'}
        <UiIcon name="chevron-right" size={16} />
      </a>
      <Words as="h1" text="Every icon and illustration your product needs." delay={80} />
      <p className="lp-sub rv" data-reveal="" style={{ ['--i' as string]: 4 }}>
        {fmt(Math.floor(icons / 1000) * 1000)}+ icons in five styles and {fmt(ills)} isometric illustrations, still, animated or
        interactive. {phone ? 'Ready for Figma, React and your AI builder.' : 'One hand-drawn system, ready for Figma, React and your AI builder.'}
      </p>
      <form className="lp-search rv" data-reveal="" style={{ ['--i' as string]: 5 }} onSubmit={submit} role="search">
        <label className="search search-tablet">
          <UiIcon name="search" size={20} />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={phone ? 'Search icons and illustrations' : 'Search icons and illustrations, e.g. empty inbox'}
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
      <div className="lp-try rv" data-reveal="" style={{ ['--i' as string]: 6 }}>
        <span>Try</span>
        {['home', 'payment', 'empty state', 'onboarding', 'analytics', 'notification', 'dark mode'].map((t) => (
          <button key={t} className="chip" onClick={() => onSearch(t, mode)}>
            {t}
          </button>
        ))}
      </div>
      <div className="lp-ctas rv" data-reveal="" style={{ ['--i' as string]: 7 }}>
        <a className="btn btn-primary btn-lg btn-shine" href="#library">
          <UiIcon name="arrow-up-right" size={18} />
          <Roll text={`Browse ${fmt(Math.floor(icons / 1000) * 1000)}+ free icons`} />
        </a>
        <a className="btn btn-outline btn-lg" href="#home" onClick={(e) => (e.preventDefault(), toSection('pricing'))}>
          <Roll text="See plans · pay once from $49" />
        </a>
      </div>
      <div className="rv" data-reveal="" style={{ ['--i' as string]: 8 }}>
        <Ticks items={phone ? ['Light and Regular free forever', 'Commercial licence · 14-day refund'] : ['Light and Regular free forever', 'Commercial licence', '14-day refund']} />
      </div>
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
    // Newest first, so every new batch shows up on the landing page; one per category for variety.
    const newest = [...list].sort((x, y) => (y.a ?? -1) - (x.a ?? -1));
    for (const it of newest) {
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
  phone,
  svgs,
  theme,
  illustrations,
  icons,
  ills,
  onToast,
}: {
  phone: boolean;
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
  const [hover, setHover] = useState<string | null>(null);
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
        <div className="lp-card lp-icons-card rv" data-reveal="">
          <div className="lp-card-head">
            <span>
              <b>Icons</b>
              {phone ? `${fmt(icons)} · 5 styles` : `${fmt(icons)} icons · one 24 px grid · five styles`}
            </span>
            <div className="segmented" role="radiogroup" aria-label="Style">
              {STYLES.map(([id, l]) => (
                <button key={id} role="radio" aria-checked={style === id} aria-selected={style === id} className="seg seg-sm" onClick={() => setStyle(id)}>
                  {phone && id === 'duotone' ? 'Duo' : l}
                </button>
              ))}
            </div>
          </div>
          <div className="lp-icon-grid">
            {(phone ? SHOW.slice(0, 8) : SHOW).map((n) => (
              <button
                key={n}
                className={`lp-tile${copied === n ? ' is-copied' : ''}`}
                onClick={() => copy(n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(null)}
                aria-label={`Copy ${n} SVG`}
                style={{ ['--px' as string]: `${size + 8}px` }}
              >
                {hover === n && motion?.[n] ? (
                  <Animated svg={svgs[`${n}:${style}`]} spec={motion[n]} size={size + 8} colour={copied === n ? '#3A57FF' : theme === 'dark' ? '#F4F4F5' : '#171729'} />
                ) : (
                  <LibIcon svg={svgs[`${n}:${style}`]} />
                )}
                {copied === n && (
                  <span className="tile-check" aria-hidden="true">
                    <UiIcon name="check" size={14} strokeWidth={2} />
                  </span>
                )}
              </button>
            ))}
          </div>
          {!phone && (
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
          )}
        </div>

        <div className="lp-card lp-ill-card rv" data-reveal="" style={{ ['--i' as string]: 1 }}>
          <div className="lp-card-head">
            <span>
              <b>Illustrations</b>
              {phone ? `${fmt(ills)} scenes` : `${fmt(ills)} isometric scenes, still, animated or live`}
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
            {ill?.live ? (
              <LiveIllustration key={ill.n + type} name={ill.n} mode="interactive" style={type} theme={theme} colour={null} tags={false} />
            ) : (
              <IllView item={ill} type={type} theme={theme} />
            )}
          </div>
        </div>

        {!phone && (
        <div className="lp-card lp-anim-card rv" data-reveal="" style={{ ['--i' as string]: 2 }}>
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

        )}
        {!phone && (
        <div className="lp-card lp-figma-card rv" data-reveal="" style={{ ['--i' as string]: 3 }}>
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
        )}
      </div>
    </section>
  );
}

function IconsSection({ svgs, icons, phone }: { svgs: Record<string, string>; icons: number; phone: boolean }) {
  if (phone)
    return (
      <section className="lp-section lp-split lp-pstack" id="icons">
        <Head eyebrow="ICONS" title="One icon, five styles, every size." sub="Soft, continuous strokes on one 24 px grid, with an optical stroke for 16, 20, 24 and 32 px." />
        <div className="lp-card lp-matrix rv" data-reveal="">
          <div className="lp-matrix-row is-head">
            {STYLES.map(([s, l]) => (
              <span key={s}>{s === 'duotone' ? 'Duo' : l}</span>
            ))}
          </div>
          {['home', 'bell', 'heart', 'chat'].map((n, r) => (
            <div key={n} className="lp-matrix-row">
              {STYLES.map(([s], c) => (
                <span key={s} className="lp-cell" style={{ ['--r' as string]: r, ['--c' as string]: c }}>
                  <LibIcon svg={svgs[`${n}:${s}`]} />
                </span>
              ))}
            </div>
          ))}
        </div>
        <a className="btn btn-outline btn-lg btn-block" href="#library">
          <UiIcon name="arrow-up-right" size={18} />
          <Roll text="Browse all icons" />
        </a>
      </section>
    );
  return (
    <section className="lp-section lp-split" id="icons">
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
          <Roll text={`Browse all ${fmt(icons)} icons`} />
        </a>
      </div>
      <div className="lp-card lp-matrix rv" data-reveal="" style={{ ['--i' as string]: 1 }}>
        <div className="lp-matrix-row is-head">
          {STYLES.map(([s, l]) => (
            <span key={s}>
              {l}
              {PRO_STYLE.has(s) && <span className="badge-pro">PRO</span>}
            </span>
          ))}
        </div>
        {['home', 'bell', 'heart', 'calendar', 'chat'].map((n, r) => (
          <div key={n} className="lp-matrix-row">
            {STYLES.map(([s], c) => (
              <span key={s} className="lp-cell" style={{ ['--r' as string]: r, ['--c' as string]: c }}>
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

function IllustrationsSection({ illustrations, industries, theme, ills, phone }: { illustrations: Illustration[] | null; industries: Category[]; theme: Theme; ills: number; phone: boolean }) {
  const picks = useShowcaseIllustrations(illustrations, 6).slice(1, 5);
  if (phone)
    return (
      <section className="lp-section lp-split lp-pstack is-surface" id="illustrations">
        <Head eyebrow="ILLUSTRATIONS" title="Isometric scenes that explain your product." sub="Stroke, Fill or Duotone, in your brand colour, light or dark." />
        <div className="lp-pcards">
          {picks.slice(0, 2).map((it, i) => {
            const t: IllustrationType = i ? 'duotone' : 'fill';
            return (
              <a key={it.n} className="lp-pcard rv" data-reveal="" style={{ ['--i' as string]: i }} href="#library?mode=illustrations">
                <span className="lp-pcard-preview">
                  {it.live ? (
                    <LiveIllustration name={it.n} mode="scroll" style={t} theme={theme} colour={null} tags={false} />
                  ) : (
                    <IllView item={it} type={t} theme={theme} />
                  )}
                </span>
                <span className="lp-pcard-meta">
                  <b>{it.t}</b>
                  <span className="badge-neutral">{t.toUpperCase()}</span>
                </span>
              </a>
            );
          })}
        </div>
        <div className="lp-industries rv" data-reveal="">
          {[...industries].sort((x, y) => y.count - x.count).slice(0, 8).map((c) => (
            <a key={c.id} className="chip" href="#library?mode=illustrations">
              {c.title}
            </a>
          ))}
        </div>
        <a className="btn btn-primary btn-lg btn-block" href="#library?mode=illustrations">
          <UiIcon name="arrow-up-right" size={18} />
          <Roll text={`Browse ${fmt(ills)} illustrations`} />
        </a>
      </section>
    );
  const types: [IllustrationType | 'animated', string][] = [
    ['stroke', 'STROKE'],
    ['stroke', 'STROKE'],
    ['stroke', 'STROKE'],
    ['animated', 'STROKE'],
  ];
  // Cards 1–3 play as you scroll (the Scroll mode of the live figures); card 4 loops.
  return (
    <section className="lp-section is-surface" id="illustrations">
      <Head
        center
        eyebrow="ILLUSTRATIONS"
        title="Isometric scenes that explain your product."
        sub={`${fmt(ills)} hand-built scenes for empty states, onboarding, pricing and heroes. Stroke, Fill or Duotone, in your brand colour, light or dark.`}
      />
      <div className="lp-ill-cards">
        {picks.map((it, i) => (
          <a key={it.n} className="lp-ill-item rv" data-reveal="" style={{ ['--i' as string]: i }} href="#library?mode=illustrations">
            <span className="lp-ill-frame">
              {it.live ? (
                <LiveIllustration
                  name={it.n}
                  mode={types[i][0] === 'animated' ? 'animated' : 'scroll'}
                  style={types[i][0] === 'animated' ? 'stroke' : (types[i][0] as IllustrationType)}
                  theme={theme}
                  colour={null}
                  tags={false}
                />
              ) : (
                <IllView item={it} type={types[i][0] === 'animated' ? 'stroke' : (types[i][0] as IllustrationType)} theme={theme} />
              )}
              <span className="badge-new lp-ill-tag">{types[i][0] === 'animated' ? 'ANIMATED' : 'SCROLL TO PLAY'}</span>
            </span>
            <span className="lp-ill-meta">
              <b>{it.t}</b>
              <span className="badge-neutral">{types[i][1]}</span>
            </span>
          </a>
        ))}
      </div>
      <div className="lp-industries rv" data-reveal="">
        {[...industries].sort((x, y) => y.count - x.count).slice(0, 16).map((c) => (
          <a key={c.id} className="chip" href="#library?mode=illustrations">
            {c.title}
          </a>
        ))}
      </div>
      <a className="btn btn-primary btn-lg" href="#library?mode=illustrations">
        <UiIcon name="arrow-up-right" size={18} />
        <Roll text={`Browse ${fmt(ills)} illustrations`} />
      </a>
    </section>
  );
}

function MotionSection({ svgs, illustrations, phone }: { svgs: Record<string, string>; illustrations: Illustration[] | null; phone: boolean }) {
  const motion = useMotion();
  const live = useMemo(() => (illustrations ?? []).filter((i) => i.live), [illustrations]);
  if (phone)
    return (
      <section className="lp-section lp-motion lp-pstack force-dark" id="animated">
        <Head eyebrow="MOTION" title="Icons that move. Illustrations that react." sub="Hover, follow the pointer or scroll. Export Lottie, .lottie or GIF." />
        {(
          [
            [
              'play',
              'Animated icons',
              'Pop-in, draw-on, wiggle and pulse.',
              <span key="a" className="lp-mrow-tile">
                <Animated svg={svgs['bell:regular']} spec={motion?.bell} size={28} colour="#171729" />
              </span>,
            ],
            [
              'sparkle',
              'Interactive illustrations',
              'Figures that follow the pointer.',
              live[2] ? <LiveIllustration key="i" name={live[2].n} mode="interactive" style="stroke" theme="dark" colour={null} tags={false} /> : null,
            ],
            [
              'layers',
              'Scroll illustrations',
              'Scenes that play as you scroll.',
              live[7] ? <LiveIllustration key="s" name={live[7].n} mode="scroll" style="stroke" theme="dark" colour={null} tags={false} /> : null,
            ],
          ] as [UiIconName, string, string, ReactNode][]
        ).map(([ic, t, d, visual], i) => (
          <div key={t} className="lp-mrow rv" data-reveal="" style={{ ['--i' as string]: i }}>
            <span className="lp-mrow-visual">{visual}</span>
            <span className="lp-mrow-text">
              <b>
                <UiIcon name={ic} size={18} />
                {t}
              </b>
              <span>{d}</span>
            </span>
          </div>
        ))}
      </section>
    );
  const cards: [UiIconName, string, string, ReactNode, string | null][] = [
    [
      'play',
      'Animated icons',
      'Every icon can pop in, draw on, wiggle or pulse. Export Lottie, .lottie, GIF or animated SVG.',
      <div key="a" className="lp-motion-icons">
        {['bell', 'heart'].map((n) => (
          <span key={n} className="lp-tile is-static">
            <Animated svg={svgs[`${n}:regular`]} spec={motion?.[n]} size={32} colour="#171729" />
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
    <section className="lp-section lp-motion force-dark" id="animated">
      <Head
        center
        eyebrow="MOTION"
        title="Icons that move. Illustrations that react."
        sub="Motion is built into the library, not added later. Hover, follow the pointer or scroll, with exports for every tool."
      />
      <div className="lp-motion-cards">
        {cards.map(([ic, t, d, visual, tag], i) => (
          <div key={t} className="lp-motion-card rv" data-reveal="" style={{ ['--i' as string]: i }}>
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
        <Roll text="See motion in the library" />
      </a>
    </section>
  );
}

function PluginSection({ svgs, icons, phone }: { svgs: Record<string, string>; icons: number; phone: boolean }) {
  // A little demo loop: a tile gets "inserted" every 1.8 s and the toast names it.
  const [ref, inView] = useInView<HTMLDivElement>();
  const [pick, setPick] = useState(2);
  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setPick((p) => (p + 3) % SHOW.length), 1800);
    return () => clearInterval(t);
  }, [inView]);
  if (phone)
    return (
      <section className="lp-section lp-split lp-pstack lp-pplugin" id="figma-plugin">
        <Head eyebrow="FIGMA PLUGIN" title="Drop components, not pictures." sub="Click an icon and it lands on your canvas as a component, with every style as a variant." />
        <ul className="lp-ppoints" role="list">
          {[
            ['Every style is a variant', 'Swap Regular for Fill in the properties panel.'],
            ['Named for search', 'Assets search finds every icon by name.'],
          ].map(([t, d], i) => (
            <li key={t} className="rv" data-reveal="" style={{ ['--i' as string]: i }}>
              <UiIcon name="check" size={18} />
              <span>
                <b>{t}</b>
                {d}
              </span>
            </li>
          ))}
        </ul>
        <a className="btn btn-primary btn-lg btn-block" href="#figma">
          <FigmaMark size={18} />
          <Roll text="Get the Figma plugin" />
        </a>
      </section>
    );
  return (
    <section className="lp-section lp-split is-reverse" id="figma-plugin">
      <div className="lp-plugin rv" data-reveal="" ref={ref} aria-hidden="true">
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
            {SHOW.map((n, i) => (
              <span key={n} className={`lp-tile is-static${i === pick ? ' is-copied' : ''}`}>
                <LibIcon svg={svgs[`${n}:regular`]} />
              </span>
            ))}
          </div>
          <span className="toast lp-plugin-toast" key={pick}>
            <span className="toast-ok">
              <UiIcon name="check" size={16} strokeWidth={2} />
            </span>
            {SHOW[pick]} added to Figma as a component
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
            <Roll text="Get the Figma plugin" />
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
    <section className="lp-section lp-split is-surface" id="developers">
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
          <Roll text="Read the docs" />
        </a>
      </div>
      <div className="lp-code force-dark rv" data-reveal="">
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
            <code key={i} style={{ ['--l' as string]: i }}>
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
    <section className="lp-section" id="how">
      <Head center eyebrow="HOW IT WORKS" title="From search to shipped in three clicks." />
      <div className="lp-steps">
        {(
          [
            ['01', 'search', 'Find', `Search ${fmt(icons)} icons and ${fmt(ills)} illustrations by name, tag or industry. Typos and plurals are fine.`],
            ['02', 'palette', 'Customise', 'Pick a style, colour and size, light or dark. Duotone tints follow your colour.'],
            ['03', 'download', 'Ship', 'Copy SVG or JSX, download PNG, Lottie, .lottie or GIF, or insert into Figma.'],
          ] as [string, UiIconName, string, string][]
        ).map(([n, ic, t, d], i) => (
          <div key={n} className="lp-step rv" data-reveal="" style={{ ['--i' as string]: i }}>
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

function Faq({ phone }: { phone: boolean }) {
  const [open, setOpen] = useState(0);
  if (phone)
    return (
      <section className="lp-section lp-faq lp-pstack" id="faq">
        <Head eyebrow="FAQ" title="Questions, answered." />
        <div className="lp-faq-list">
          {QA.filter((_, i) => i !== 3 && i !== 5).map(([q, ans], i) => (
            <div key={q} className={`lp-qa rv${open === i ? ' is-open' : ''}`} data-reveal="" style={{ ['--i' as string]: i }}>
              <button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{q}</span>
                <UiIcon name="plus" size={24} />
              </button>
              <div className="lp-qa-a">
                <p>{ans}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  return (
    <section className="lp-section lp-faq" id="faq">
      <div className="lp-copy">
        <Head eyebrow="FAQ" title="Questions, answered." sub="Something else? Write to us and a real person replies within a day." />
        <a className="btn btn-outline btn-md" href="#contact">
          <Roll text="Contact support" />
        </a>
      </div>
      <div className="lp-faq-list">
        {QA.map(([q, ans], i) => (
          <div key={q} className={`lp-qa rv${open === i ? ' is-open' : ''}`} data-reveal="" style={{ ['--i' as string]: i }}>
            <button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
              <span>{q}</span>
              <UiIcon name="plus" size={20} />
            </button>
            <div className="lp-qa-a">
              <p>{ans}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Smooth-scrolls to a section of this page (the nav sits on top, see scroll-margin in motion.css). */
function toSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const CTA_ROW: [string, IconStyle][] = [
  ['home', 'regular'],
  ['bell', 'regular'],
  ['heart', 'fill'],
  ['folder', 'regular'],
  ['chat', 'fill'],
];
const FIELD_NAMES = ['home', 'user', 'bell', 'search', 'heart', 'mail', 'lock', 'folder', 'calendar', 'chat'];
const FIELD_STYLES: IconStyle[] = ['light', 'regular', 'bold'];

/**
 * Final CTA (Figma 153:10616): a faint field of library icons behind the card that drifts
 * sideways and brightens under the pointer; the icon row takes turns playing its animation.
 */
function FinalCta({ theme, phone }: { theme: Theme; phone: boolean }) {
  const field = useLibraryIcons([...CTA_ROW, ...FIELD_NAMES.flatMap((n) => FIELD_STYLES.map((st) => [n, st] as [string, IconStyle]))]);
  const motion = useMotion();
  const [ref, inView] = useInView<HTMLDivElement>();
  const [active, setActive] = useState(2);
  const [hover, setHover] = useState<number | null>(null);
  useEffect(() => {
    if (!inView || hover !== null) return;
    const t = setInterval(() => setActive((a) => (a + 1) % CTA_ROW.length), 1600);
    return () => clearInterval(t);
  }, [inView, hover]);
  const on = hover ?? active;
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const box = e.currentTarget.querySelector<HTMLElement>('.lp-field');
    if (!box) return;
    const r = box.getBoundingClientRect();
    e.currentTarget.style.setProperty('--fx', `${Math.round(e.clientX - r.left)}px`);
    e.currentTarget.style.setProperty('--fy', `${Math.round(e.clientY - r.top)}px`);
  };
  // 6 rows x 27 columns: rows alternate a 36 px offset, every column 72 px apart (as in Figma).
  const cells = (row: number) =>
    Array.from({ length: 27 }, (_, c) => {
      const n = FIELD_NAMES[c % 10];
      const st = FIELD_STYLES[(row + Math.floor(c / 10)) % 3];
      return (
        <span key={c} style={{ left: (row % 2 ? 60 : 24) + c * 72, top: 20 + row * 76 }}>
          <LibIcon svg={field[`${n}:${st}`]} />
        </span>
      );
    });
  const grid = Array.from({ length: 6 }, (_, r) => cells(r));
  return (
    <div className="lp-final-card rv" data-reveal="" ref={ref} onPointerMove={move}>
      <div className="lp-field" aria-hidden="true">
        <div className="lp-field-track">{grid}</div>
      </div>
      <div className="lp-field is-lit" aria-hidden="true">
        <div className="lp-field-track">{grid}</div>
      </div>
      {!phone && (
      <div className="lp-final-icons" aria-hidden="true" onMouseLeave={() => setHover(null)}>
        {CTA_ROW.map(([n, st], i) => (
          <span key={n} className={i === on ? 'is-on' : undefined} style={{ ['--i' as string]: i }} onMouseEnter={() => setHover(i)}>
            {i === on && motion?.[n] ? (
              <Animated key={`${n}${on}`} svg={field[`${n}:${st}`]} spec={motion[n]} size={28} colour={theme === 'dark' ? '#8EA0FF' : '#3A57FF'} />
            ) : (
              <LibIcon svg={field[`${n}:${st}`]} />
            )}
          </span>
        ))}
      </div>
      )}
      <Words text="Ship screens that look finished." />
      <p>{phone ? 'Every icon in Light and Regular, free forever.' : 'Start with every icon in Light and Regular, free forever. Upgrade for motion, every style and every illustration type.'}</p>
      <div className="lp-ctas">
        <a className="btn btn-primary btn-lg lp-final-btn" href="#library">
          <UiIcon name="arrow-up-right" size={20} />
          <Roll text="Browse the library" />
        </a>
        <a className={`btn ${phone ? 'btn-outline' : 'btn-muted'} btn-lg lp-final-btn`} href="#home" onClick={(e) => (e.preventDefault(), toSection('pricing'))}>
          <Roll text="See pricing" />
        </a>
      </div>
      {!phone && <Ticks items={['Commercial licence', '14-day refund', 'New batches every week']} />}
    </div>
  );
}
