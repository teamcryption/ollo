'use client';
// Illustrations screen (Figma 33:4883 desktop, 38:11748 tablet, 36:8623 phone).
import { useEffect, useMemo, useState } from 'react';
import { fmt, loadIllustrations, searchIcons, svgDataUrl, type Category, type Illustration } from '@/lib/data';
import { illustrationSvg, type IllTheme } from '@/lib/illustration';
import type { LiveMode } from '@/lib/hairline';
import { LiveIllustration } from './LiveIllustration';
import { IN_FIGMA, figmaInsert, figmaPro } from '@/lib/figma';
import { nameSvg } from '@/lib/data';
import type { Theme } from '@/lib/hooks';
import { UiIcon } from './ui-icons';
import type { DownloadTarget } from './DownloadModal';
import { Select } from './shared';

type IllType = 'stroke' | 'fill' | 'duotone';
type Kind = 'all' | 'static' | 'interactive' | 'scroll' | 'pages' | 'empty';
const KINDS: { id: Kind; label: string; short?: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'static', label: 'Static' },
  { id: 'interactive', label: 'Interactive' },
  { id: 'scroll', label: 'Scroll' },
  { id: 'pages', label: 'Pre-built pages' },
  { id: 'empty', label: 'Empty states' },
];
const COLOURS = [
  { id: 'ink', label: 'Ink', hex: '' },
  { id: 'royal', label: 'Royal blue', hex: '#3A57FF' },
  { id: 'red', label: 'Red', hex: '#E5484D' },
  { id: 'amber', label: 'Amber', hex: '#F5A524' },
  { id: 'pink', label: 'Pink', hex: '#E93D82' },
];
// Category ids from the illustration meta → industry names for the Collections panel.
const INDUSTRY: Record<string, string> = {
  technology: 'SaaS & Tech',
  business: 'Marketing & Analytics',
  commerce: 'E-commerce',
  security: 'Security',
  finance: 'Finance & Fintech',
  health: 'Healthcare',
  education: 'Education',
  travel: 'Travel',
  food: 'Food & Delivery',
  logistics: 'Logistics',
  energy: 'Energy',
  realestate: 'Real Estate',
  agriculture: 'Agriculture',
  fitness: 'Fitness',
  design: 'Design',
  media: 'Media & Events',
  science: 'Science',
  construction: 'Construction',
  automotive: 'Automotive',
  fashion: 'Fashion & Retail',
  hospitality: 'Hospitality',
  marketing: 'Marketing',
  office: 'Office & Legal',
  gaming: 'Gaming',
  government: 'Government',
  home: 'Home & Living',
  transport: 'Transport',
  manufacturing: 'Manufacturing',
  music: 'Music',
  pets: 'Pets',
  sports: 'Sports',
  kids: 'Kids & Toys',
};
/** Kinds that run the illustration live instead of showing its still. */
const isLive = (k: Kind): k is 'interactive' | 'scroll' => k === 'interactive' || k === 'scroll';

export function useIllustrationState() {
  const [items, setItems] = useState<Illustration[] | null>(null);
  const [collection, setCollection] = useState('all');
  const [kind, setKind] = useState<Kind>('all');
  const [type, setType] = useState<IllType>('stroke');
  const [animatedOnly, setAnimatedOnly] = useState(false);
  const [colour, setColour] = useState('ink');
  const [custom, setCustom] = useState('#3A57FF');
  const [theme, setTheme] = useState<'auto' | IllTheme>('auto');
  const [sort, setSort] = useState<'popular' | 'az'>('popular');
  useEffect(() => {
    loadIllustrations().then(setItems);
  }, []);
  const categories: Category[] = useMemo(() => {
    const c = new Map<string, number>();
    for (const i of items ?? []) c.set(i.c, (c.get(i.c) ?? 0) + 1);
    return [...c].map(([id, count]) => ({ id, title: INDUSTRY[id] ?? id[0].toUpperCase() + id.slice(1), count }));
  }, [items]);
  return {
    items, collection, setCollection, kind, setKind, type, setType, animatedOnly, setAnimatedOnly,
    colour, setColour, custom, setCustom, theme, setTheme, sort, setSort, categories,
  };
}
export type IllState = ReturnType<typeof useIllustrationState>;

export function IllustrationSidebar({ s }: { s: IllState }) {
  const total = s.items?.length ?? 0;
  const row = (id: string, label: string, n: number, icon?: boolean) => (
    <button key={id} className="coll" aria-current={s.collection === id ? 'true' : undefined} onClick={() => s.setCollection(id)}>
      {icon && <UiIcon name="grid" size={18} />}
      <span className="coll-label">{label}</span>
      <span className="coll-count">{fmt(n)}</span>
    </button>
  );
  return (
    <>
      <p className="side-label">INDUSTRIES</p>
      {row('all', 'All illustrations', total, true)}
      {s.categories.map((c) => row(c.id, c.title, c.count))}
    </>
  );
}

function StyleChips({ s }: { s: IllState }) {
  return (
    <div className="chip-group" role="radiogroup" aria-label="Style">
      {(['stroke', 'fill', 'duotone'] as IllType[]).map((t) => (
        <button key={t} role="radio" aria-checked={s.type === t} className="chip" onClick={() => s.setType(t)}>
          {t[0].toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );
}

function Colours({ s }: { s: IllState }) {
  return (
    <div className="swatches" role="radiogroup" aria-label="Colours">
      {COLOURS.map((c) => (
        <button
          key={c.id}
          role="radio"
          aria-checked={s.colour === c.id}
          aria-label={c.label}
          className="swatch"
          style={{ ['--sw' as string]: c.hex || 'var(--color-asset-ink)' }}
          onClick={() => s.setColour(c.id)}
        />
      ))}
      <label className={`swatch-custom icon-btn icon-btn-sm${s.colour === 'custom' ? ' is-on' : ''}`} aria-label="Custom colour" style={{ ['--sw' as string]: s.custom }}>
        <UiIcon name="plus" size={16} />
        <input type="color" value={s.custom} onChange={(e) => (s.setCustom(e.target.value.toUpperCase()), s.setColour('custom'))} />
      </label>
    </div>
  );
}

function AnimatedOnly({ s }: { s: IllState }) {
  return (
    <button className="switch" role="switch" aria-checked={s.animatedOnly} onClick={() => s.setAnimatedOnly(!s.animatedOnly)}>
      <span className="track" aria-hidden="true">
        <span className="thumb" />
      </span>
      Animated only
    </button>
  );
}

function ThemeSelect({ s, site }: { s: IllState; site: Theme }) {
  return (
    <Select label="Theme" small value={s.theme === 'auto' ? site : s.theme} onChange={(v) => s.setTheme(v as IllState['theme'])}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </Select>
  );
}

export function IllustrationFilters({ s, site }: { s: IllState; site: Theme }) {
  return (
    <div className="sheet-filters">
      <div className="sheet-group">
        <span className="filter-label">Style</span>
        <StyleChips s={s} />
      </div>
      <div className="sheet-group">
        <AnimatedOnly s={s} />
      </div>
      <div className="sheet-group">
        <span className="filter-label">Colours</span>
        <Colours s={s} />
      </div>
      <div className="sheet-group sheet-row">
        <span className="filter-label">Theme</span>
        <ThemeSelect s={s} site={site} />
      </div>
    </div>
  );
}

export function Illustrations({
  s,
  query,
  searchField,
  openFilters,
  onToast,
  onOpen,
  theme,
}: {
  s: IllState;
  query: string;
  searchField: React.ReactNode;
  openFilters: () => void;
  onOpen: (t: DownloadTarget) => void;
  onToast?: (t: string) => void;
  theme: Theme;
}) {
  const [tile, setTile] = useState<'S' | 'M' | 'L'>('M');
  const all = s.items ?? [];
  const liveCount = all.filter((i) => i.live).length;
  const kindCount = (k: Kind) => (k === 'all' || k === 'static' ? all.length : isLive(k) ? liveCount : 0);
  const list = useMemo(() => {
    let l = s.items ?? [];
    if (s.collection !== 'all') l = l.filter((i) => i.c === s.collection);
    if (isLive(s.kind)) l = l.filter((i) => i.live);
    else if (s.kind !== 'all' && s.kind !== 'static') l = [];
    if (s.animatedOnly) l = l.filter((i) => i.motion);
    // Same relevance search as icons: names, titles, tags, industry, plurals and synonyms.
    if (query.trim()) l = searchIcons(l, query, new Map(s.categories.map((c) => [c.id, c.title])));
    else if (s.sort === 'az') l = [...l].sort((a, b) => a.t.localeCompare(b.t));
    return l;
  }, [s.items, s.collection, s.kind, s.animatedOnly, s.sort, query]);

  const effTheme: IllTheme = s.theme === 'auto' ? theme : s.theme;
  const hex = s.colour === 'ink' ? null : s.colour === 'custom' ? s.custom : COLOURS.find((c) => c.id === s.colour)!.hex;
  const title = s.collection === 'all' ? 'All illustrations' : (s.categories.find((c) => c.id === s.collection)?.title ?? '');
  const total = all.length;

  return (
    <>
      <div className="compact-controls only-compact">
        {searchField}
        <div className="chip-scroll" role="group" aria-label="Kind">
          {KINDS.map((k) => (
            <button key={k.id} className="chip" aria-pressed={s.kind === k.id} onClick={() => s.setKind(k.id)}>
              {k.id === 'all' ? `All · ${fmt(total)}` : k.label}
            </button>
          ))}
        </div>
        <div className="mode-switch ill-type-seg only-phone" role="radiogroup" aria-label="Style">
          {(['stroke', 'fill', 'duotone'] as IllType[]).map((t) => (
            <button key={t} role="radio" aria-checked={s.type === t} aria-selected={s.type === t} className="seg seg-sm" onClick={() => s.setType(t)}>
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="title-row">
        <div className="title">
          <h1>{title}</h1>
          <p className="only-desktop">{fmt(list.length)} isometric illustrations in Stroke, Fill and Duotone, still or animated</p>
          <p className="only-tablet">{fmt(list.length)} illustrations</p>
          <p className="only-phone result-count">{fmt(list.length)} illustrations</p>
        </div>
        <div className="segmented segmented-tight only-desktop" role="radiogroup" aria-label="Tile size">
          {(['S', 'M', 'L'] as const).map((t) => (
            <button key={t} role="radio" aria-checked={tile === t} aria-selected={tile === t} className="seg seg-sm" onClick={() => setTile(t)}>
              {t}
            </button>
          ))}
        </div>
        <button className="btn btn-outline btn-md only-tablet" onClick={openFilters}>
          <UiIcon name="sliders" size={20} />
          Filters
        </button>
        <button className="btn btn-outline btn-sm only-phone" onClick={openFilters}>
          <UiIcon name="sliders" size={16} />
          Filters
        </button>
        <Select label="Sort" className="only-wide" value={s.sort} onChange={(v) => s.setSort(v as 'popular' | 'az')}>
          <option value="popular">Most popular</option>
          <option value="az">Name A–Z</option>
        </Select>
      </div>

      <div className="kind-tabs only-desktop" role="tablist" aria-label="Kind">
        {KINDS.slice(0, 5).map((k) => (
          <button key={k.id} role="tab" aria-selected={s.kind === k.id} className="kind-tab" onClick={() => s.setKind(k.id)}>
            {k.label} <span className="mono">{fmt(kindCount(k.id))}</span>
          </button>
        ))}
      </div>

      <div className="filter-bar only-desktop">
        <span className="filter-label">Style</span>
        <StyleChips s={s} />
        <span className="divider" />
        <AnimatedOnly s={s} />
        <span className="divider" />
        <span className="filter-label">Colours</span>
        <Colours s={s} />
        <span className="grow" />
        <span className="filter-label">Theme</span>
        <ThemeSelect s={s} site={theme} />
      </div>

      {!s.items ? (
        <div className={`ill-grid tile-${tile}`} aria-busy="true">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="ill-card">
              <div className="ill-tile is-skeleton" />
            </div>
          ))}
        </div>
      ) : list.length ? (
        <ul className={`ill-grid tile-${tile}`} role="list">
          {list.map((item) => (
            <li key={item.n}>
              <IllCard
                item={item}
                live={isLive(s.kind) && item.live ? s.kind : null}
                animate={s.kind !== 'static'}
                type={s.type}
                theme={effTheme}
                colour={hex}
                onOpen={() => {
                  if (!IN_FIGMA) return onOpen({ kind: 'illustration', item, list, categories: s.categories });
                  // Figma plugin: insert as a component with a Type variant (Free: Stroke; Pro: + Fill, Duotone).
                  const types = (['stroke', 'fill', 'duotone'] as IllType[]).filter((t) => item.types[t] && (figmaPro() || t === 'stroke'));
                  const label = (t: IllType) => t[0].toUpperCase() + t.slice(1);
                  figmaInsert({
                    name: item.n,
                    title: item.t,
                    prop: 'Type',
                    variants: types.map((t) => ({ label: label(t), svg: nameSvg(illustrationSvg(item, { type: t, theme: effTheme, colour: hex }), item.n) })),
                    pick: types.includes(s.type) ? label(s.type) : 'Stroke',
                    size: 260,
                    kind: 'illustration',
                  });
                  onToast?.(`${item.t} added to Figma`);
                }}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">{s.kind === 'pages' || s.kind === 'empty' ? 'This kind of illustration is coming soon.' : 'No illustrations match.'}</p>
      )}

      {list.length > 0 && (
        <div className="load-more">
          <span>
            Showing {fmt(list.length)} of {fmt(list.length)} illustrations
          </span>
        </div>
      )}
    </>
  );
}

/** A live tile (Interactive, Scroll): the figure itself, answering the pointer or the page's scroll. */
function IllCard({ item, live, animate, type, theme, colour, onOpen }: { item: Illustration; live: LiveMode | null; animate: boolean; type: IllType; theme: IllTheme; colour: string | null; onOpen: () => void }) {
  if (live) {
    return (
      <div className="ill-card">
        <span className="ill-tile is-live" onClick={onOpen}>
          <LiveIllustration name={item.n} mode={live} style={type} theme={theme} colour={colour} />
        </span>
        <button className="ill-name ill-name-btn" onClick={onOpen} aria-label={`${item.t}, open download options`}>
          {item.t}
        </button>
      </div>
    );
  }
  return <StillCard item={item} animate={animate} type={type} theme={theme} colour={colour} onOpen={onOpen} />;
}

/** A still tile; a live illustration plays its animation while the pointer is over it. */
function StillCard({ item, animate, type, theme, colour, onOpen }: { item: Illustration; animate: boolean; type: IllType; theme: IllTheme; colour: string | null; onOpen: () => void }) {
  const [hover, setHover] = useState(false);
  const still = useMemo(() => illustrationSvg(item, { type, theme, colour }), [item, type, theme, colour]);
  const moving = useMemo(
    () => (animate && hover && item.motion ? illustrationSvg(item, { type, theme, colour, motion: 'float' }) : null),
    [animate, hover, item, type, theme, colour],
  );
  const playing = animate && hover && !!item.live;
  return (
    <button
      className="ill-card"
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      aria-label={`${item.t}, open download options`}
    >
      <span className={`ill-tile theme-${theme}${playing ? ' is-live' : ''}`}>
        {playing ? (
          <LiveIllustration name={item.n} mode="animated" style={type} theme={theme} colour={colour} />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={svgDataUrl(moving ?? still)} alt="" />
        )}
      </span>
      <span className="ill-name">{item.t}</span>
    </button>
  );
}
