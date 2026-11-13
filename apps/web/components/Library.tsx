'use client';

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import {
  ICON_SIZES,
  ICON_STYLES,
  animatedIconSvg,
  exportIconSvg,
  fmt,
  loadIndex,
  loadMotion,
  loadIcons,
  searchIcons,
  svgDataUrl,
  type IconEntry,
  type IconStyle,
  type Index,
  type MotionSpec,
} from '@/lib/data';
import { useLocalList, useTheme } from '@/lib/hooks';
import { Logo } from './Logo';
import { UiIcon } from './ui-icons';
import { IllustrationFilters, IllustrationSidebar, Illustrations, useIllustrationState } from './Illustrations';
import { DownloadModal, type DownloadTarget } from './DownloadModal';
import { Subscribe } from './Subscribe';
import { ANIM_FORMATS, SWATCHES, Select, copyText, type AnimFormat } from './shared';

type Mode = 'icons' | 'illustrations';
type TileSize = 'S' | 'M' | 'L';
type Sort = 'popular' | 'az';
type MotionKind = 'all' | 'pop' | 'draw' | 'wiggle' | 'pulse';

const MOTION_KINDS: { id: MotionKind; label: string }[] = [
  { id: 'all', label: 'All motion' },
  { id: 'pop', label: 'Pop-in' },
  { id: 'draw', label: 'Draw-on' },
  { id: 'wiggle', label: 'Wiggle' },
  { id: 'pulse', label: 'Pulse' },
];


// Free plan: Light and Regular. Bold, Fill and Duotone are Pro (marked in the style chips).
const PRO_STYLES = new Set<IconStyle>(['bold', 'fill', 'duotone']);

const TILE_ICON: Record<TileSize, number> = { S: 24, M: 32, L: 40 };
const PAGE = 36; // fallback before the grid has measured itself
const AUTO_LOADS = 4; // pages added by scrolling before "Load more" shows

export function Library() {
  const [theme, toggleTheme] = useTheme();
  const [mode, setMode] = useState<Mode>('icons');
  const [index, setIndex] = useState<Index | null>(null);
  const [svgs, setSvgs] = useState<Record<string, string> | null>(null);
  const [motion, setMotion] = useState<Record<string, MotionSpec> | null>(null);
  // The published preview opens on the newest batch (window.__OLLO__.start = 'latest').
  const [collection, setCollection] = useState<string>(
    () => (typeof window !== 'undefined' && (window as unknown as { __OLLO__?: { start?: string } }).__OLLO__?.start) || 'all',
  );
  const [query, setQuery] = useState('');
  const [style, setStyle] = useState<IconStyle>('regular');
  const [animated, setAnimated] = useState(false);
  const [motionKind, setMotionKind] = useState<MotionKind>('all');
  // Animated tiles always play (no Autoplay toggle, per Abdur).
  const autoplay = true;
  const [format, setFormat] = useState<AnimFormat>('lottie');
  const [colour, setColour] = useState('ink');
  const [custom, setCustom] = useState('#3A57FF');
  const [size, setSize] = useState<number>(24);
  const [tile, setTile] = useState<TileSize>('M');
  const [sort, setSort] = useState<Sort>('popular');
  const [shown, setShown] = useState(PAGE);
  const [autoLoads, setAutoLoads] = useState(0);
  const gridWrap = useRef<HTMLDivElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const page = useRef({ size: PAGE, cols: 1 });
  const [copied, setCopied] = useState<string | null>(null);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const [sheet, setSheet] = useState<null | 'filters' | 'menu'>(null);
  const [download, setDownload] = useState<DownloadTarget | null>(null);
  const recent = useLocalList('ollo-recent', 60);
  const favourites = useLocalList('ollo-favourites', 500);
  const deferredQuery = useDeferredValue(query);
  // Views by URL hash so they also work on the published preview page: #subscribe, #pro.
  const [view, setView] = useState<'library' | 'subscribe' | 'pro'>('library');
  useEffect(() => {
    const read = () => {
      const h = location.hash.slice(1);
      setView(h === 'subscribe' ? 'subscribe' : h === 'pro' ? 'pro' : 'library');
      setSheet(null);
      if (h === 'subscribe' || h === 'pro') window.scrollTo(0, 0);
    };
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);
  const toLibrary = () => {
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    setView('library');
  };
  const ill = useIllustrationState();

  useEffect(() => {
    loadIndex().then(setIndex);
  }, []);
  useEffect(() => {
    if (animated && !motion) loadMotion().then(setMotion);
  }, [animated, motion]);
  // One "page" = enough whole rows to fill the screen below the grid's top, plus two.
  const measure = useCallback(() => {
    const grid = gridWrap.current?.querySelector<HTMLElement>('.icon-grid');
    if (!grid) return page.current;
    const cols = Math.max(1, getComputedStyle(grid).gridTemplateColumns.split(' ').length);
    const gap = parseFloat(getComputedStyle(grid).rowGap) || 12;
    const tileH = (grid.clientWidth - gap * (cols - 1)) / cols;
    const top = Math.max(0, grid.getBoundingClientRect().top);
    const rows = Math.max(3, Math.ceil((window.innerHeight - top) / (tileH + gap)) + 2);
    page.current = { size: cols * rows, cols };
    return page.current;
  }, []);
  const roundRows = (n: number) => Math.ceil(n / page.current.cols) * page.current.cols;
  useEffect(() => {
    setShown(measure().size);
    setAutoLoads(0);
  }, [collection, deferredQuery, sort, mode, animated, motionKind, index, measure]);
  useEffect(() => {
    const onResize = () => {
      const p = measure();
      setShown((v) => Math.max(roundRows(v), p.size));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measure]);

  // "/" focuses the visible search field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey) return;
      const t = e.target as HTMLElement;
      if (t.closest('input,textarea,select,[contenteditable]')) return;
      const field = [...document.querySelectorAll<HTMLInputElement>('input[data-search]')].find(
        (el) => el.offsetParent !== null,
      );
      if (field) {
        e.preventDefault();
        field.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const catTitles = useMemo(() => new Map(index?.categories.map((c) => [c.id, c.title]) ?? []), [index]);

  const list = useMemo(() => {
    if (!index) return [] as IconEntry[];
    let items = index.icons;
    if (collection === 'favourites') {
      const set = new Set(favourites.items);
      items = items.filter((i) => set.has(i.n));
    } else if (collection === 'recent') {
      const byName = new Map(items.map((i) => [i.n, i]));
      items = recent.items.map((n) => byName.get(n)).filter(Boolean) as IconEntry[];
    } else if (collection === 'latest') {
      items = items.filter((i) => i.b === index.latest);
    } else if (collection === 'last5') {
      items = items.filter((i) => i.b && i.b > index.latest - 5).sort((a, b) => (b.b ?? 0) - (a.b ?? 0));
    } else if (collection !== 'all') {
      items = items.filter((i) => i.c === collection);
    }
    if (animated) items = items.filter((i) => i.a && (motionKind === 'all' || i.m === motionKind));
    items = searchIcons(items, deferredQuery, catTitles);
    // A search keeps its relevance order; the sort menu applies to browsing.
    if (sort === 'az' && !deferredQuery.trim()) items = [...items].sort((a, b) => a.t.localeCompare(b.t));
    return items;
  }, [index, collection, deferredQuery, catTitles, sort, animated, motionKind, favourites.items, recent.items]);

  const inkHex = theme === 'dark' ? '#F4F4F5' : '#171729';
  const colourHex = colour === 'ink' ? inkHex : colour === 'custom' ? custom : SWATCHES.find((s) => s.id === colour)!.hex;
  const copyHex = colour === 'ink' ? '#171729' : colourHex;

  const showToast = useCallback((text: string) => setToast({ id: Date.now(), text }), []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(null), 2400);
    return () => clearTimeout(t);
  }, [copied]);

  const onTile = async (icon: IconEntry) => {
    if (!svgs || !index) return;
    if (animated && motion?.[icon.n]) {
      setDownload({ kind: 'icon', icon, list, format });
      return;
    }
    const out = exportIconSvg(svgs[icon.n], size, copyHex, index.tokens.icon.opticalStroke, icon.n);
    if (await copyText(out)) {
      setCopied(icon.n);
      recent.push(icon.n);
      showToast('SVG copied to clipboard');
    } else {
      showToast('Copy failed: clipboard is blocked in this browser');
    }
  };

  const total = index?.total ?? 0;
  const current =
    collection === 'all'
      ? animated
        ? 'Animated icons'
        : 'All icons'
      : collection === 'latest'
        ? 'Latest batch'
        : collection === 'last5'
          ? 'Last 5 batches'
          : collection === 'favourites'
            ? 'Favourites'
            : collection === 'recent'
              ? 'Recently used'
              : (catTitles.get(collection) ?? '');
  const visible = useMemo(() => list.slice(0, shown), [list, shown]);
  // SVGs only for the icons on screen; their chunk files load on demand.
  const svgStyle = useRef(style);
  useEffect(() => {
    let live = true;
    if (svgStyle.current !== style) {
      svgStyle.current = style;
      setSvgs(null);
    }
    loadIcons(visible, style).then((d) => live && setSvgs((prev) => ({ ...(prev ?? {}), ...d })));
    return () => {
      live = false;
    };
  }, [visible, style]);
  const more = visible.length < list.length;
  // Scrolling near the end adds a page, up to AUTO_LOADS times; then "Load more" takes over.
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !more || autoLoads >= AUTO_LOADS) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        setShown((v) => roundRows(v + page.current.size));
        setAutoLoads((a) => a + 1);
      },
      { rootMargin: '0px 0px 120px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [more, autoLoads, shown]);
  const searchPlaceholder =
    mode === 'icons' ? `Search ${total ? fmt(total) : ''} icons` : `Search ${fmt(ill.items?.length ?? 0)} illustrations`;

  const modeSwitch = (cls: string) => (
    <div className={`mode-switch ${cls}`} role="tablist" aria-label="Library">
      {(['icons', 'illustrations'] as Mode[]).map((m) => (
        <button
          key={m}
          role="tab"
          aria-selected={view === 'library' && mode === m}
          className="seg seg-md"
          onClick={() => {
            setMode(m);
            toLibrary();
            setQuery('');
          }}
        >
          <UiIcon name={m === 'icons' ? 'shapes' : 'image'} size={18} />
          <span>{m === 'icons' ? 'Icons' : 'Illustrations'}</span>
        </button>
      ))}
    </div>
  );

  const searchField = (cls: string) => (
    <label className={`search ${cls}`}>
      <UiIcon name="search" size={20} className="search-icon" />
      <input
        data-search
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={searchPlaceholder}
        aria-label={mode === 'icons' ? 'Search icons' : 'Search illustrations'}
      />
      {query ? (
        <button className="search-clear" aria-label="Clear search" onClick={() => setQuery('')}>
          <UiIcon name="close" size={16} />
        </button>
      ) : (
        <kbd>/</kbd>
      )}
    </label>
  );

  const styleChips = (
    <div className="chip-group" role="radiogroup" aria-label="Style">
      {ICON_STYLES.map((s) => (
        <button
          key={s.id}
          role="radio"
          aria-checked={style === s.id}
          className="chip"
          onClick={() => setStyle(s.id)}
        >
          {style === s.id && <UiIcon name="check" size={16} />}
          {s.label}
          {PRO_STYLES.has(s.id) && <span className="badge-pro">PRO</span>}
        </button>
      ))}
    </div>
  );

  // The toggle names where it takes you: "Animated" on the static grid, "Flat icons" on the
  // animated grid. The switch itself is on (blue) while animated icons show, off for flat icons.
  const animatedSwitch = (
    <button
      className="switch"
      role="switch"
      aria-checked={animated}
      onClick={() => setAnimated((a) => !a)}
      title={animated ? 'Back to flat (static) icons' : 'Show animated icons'}
    >
      <span className="track" aria-hidden="true">
        <span className="thumb" />
      </span>
      {animated ? 'Flat icons' : 'Animated'}
    </button>
  );

  const motionChips = (
    <div className="chip-group" role="radiogroup" aria-label="Motion">
      {MOTION_KINDS.map((k) => (
        <button
          key={k.id}
          role="radio"
          aria-checked={motionKind === k.id}
          className="chip"
          onClick={() => setMotionKind(k.id)}
        >
          {motionKind === k.id && <UiIcon name="check" size={16} />}
          {k.label}
        </button>
      ))}
    </div>
  );


  const formatSelect = (
    <Select label="Format" small value={format} onChange={(v) => setFormat(v as AnimFormat)}>
      {ANIM_FORMATS.map((f) => (
        <option key={f.id} value={f.id}>
          {f.label}
        </option>
      ))}
    </Select>
  );

  const swatches = (
    <div className="swatches" role="radiogroup" aria-label="Colour">
      {SWATCHES.map((s) => (
        <button
          key={s.id}
          role="radio"
          aria-checked={colour === s.id}
          aria-label={s.label}
          className="swatch"
          style={{ ['--sw' as string]: s.id === 'ink' ? 'var(--color-asset-ink)' : s.hex }}
          onClick={() => setColour(s.id)}
        />
      ))}
      <label
        className={`swatch-custom icon-btn icon-btn-sm${colour === 'custom' ? ' is-on' : ''}`}
        aria-label="Custom colour"
        style={{ ['--sw' as string]: custom }}
      >
        <UiIcon name="plus" size={16} />
        <input
          type="color"
          value={custom}
          onChange={(e) => {
            setCustom(e.target.value.toUpperCase());
            setColour('custom');
          }}
        />
      </label>
    </div>
  );

  const sizeSelect = (
    <Select label="Size" small value={String(size)} onChange={(v) => setSize(Number(v))}>
      {ICON_SIZES.map((s) => (
        <option key={s} value={s}>
          {s} px
        </option>
      ))}
    </Select>
  );

  const sortSelect = (cls = '') => (
    <Select label="Sort" className={cls} value={sort} onChange={(v) => setSort(v as Sort)}>
      <option value="popular">Most popular</option>
      <option value="az">Name A–Z</option>
    </Select>
  );

  const latest = index?.latest ?? 0;
  const latestCount = useMemo(() => index?.icons.filter((i) => i.b === latest).length ?? 0, [index, latest]);
  const last5Count = useMemo(() => index?.icons.filter((i) => i.b && i.b > latest - 5).length ?? 0, [index, latest]);
  const batchNote =
    collection === 'latest'
      ? `Batch ${latest}${index?.batchDate[latest] ? ` · ${index.batchDate[latest]}` : ''} · `
      : collection === 'last5'
        ? `Batches ${latest - 4}–${latest} · `
        : '';

  const collectionRow = (id: string, label: string, count: number | null, icon?: Parameters<typeof UiIcon>[0]['name'], badge?: string) => (
    <button
      key={id}
      className="coll"
      aria-current={collection === id ? 'true' : undefined}
      onClick={() => {
        setCollection(id);
        setSheet(null);
      }}
    >
      {icon && <UiIcon name={icon} size={18} />}
      <span className="coll-label">{label}</span>
      {badge && <span className="badge-new">{badge}</span>}
      {count !== null && <span className="coll-count">{fmt(count)}</span>}
    </button>
  );

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <a href="/" className="logo-link" aria-label="ollo home">
            <Logo />
          </a>
          {modeSwitch('only-wide')}
        </div>
        <div className="header-center only-desktop">{searchField('search-header')}</div>
        <div className="header-spacer only-compact" />
        <nav className="header-right">
          <a className="btn btn-ghost btn-sm only-desktop" href="#subscribe" aria-current={view === 'subscribe' ? 'page' : undefined}>
            Pricing
          </a>
          <a className="btn btn-ghost btn-sm only-desktop" href="#docs">
            Docs
          </a>
          <a className="btn btn-ghost btn-sm only-desktop" href="#figma">
            Figma plugin
          </a>
          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <UiIcon name={theme === 'dark' ? 'sun' : 'moon'} size={20} />
          </button>
          <span className="header-gap only-desktop" />
          <a className="btn btn-outline btn-md only-desktop" href="#signin">
            Sign in
          </a>
          <a className="btn btn-primary btn-md only-wide" href="#pro" aria-current={view === 'pro' ? 'page' : undefined}>
            <UiIcon name="sparkle" size={20} />
            Get Pro
          </a>
          <button className="icon-btn only-compact" aria-label="Menu" onClick={() => setSheet('menu')}>
            <UiIcon name="menu" size={20} />
          </button>
        </nav>
      </header>

      {view !== 'library' ? (
        <Subscribe
          initialPlan={view === 'pro' ? 'pro' : 'free'}
          iconCount={total}
          illustrationCount={ill.items?.length ?? 0}
          onToast={showToast}
        />
      ) : (
      <>
      <div className="top-controls only-phone">
        {modeSwitch('mode-switch-full')}
        {searchField('search-phone')}
      </div>

      <div className="body">
        <aside className="sidebar only-desktop" aria-label="Collections">
          <div className="side-scroll">
          {mode === 'icons' ? (
            <>
              {latest > 0 && (
                <>
                  <p className="side-label">WHAT’S NEW</p>
                  {collectionRow('latest', `Batch ${latest}`, latestCount, 'sparkle', 'NEW')}
                  {collectionRow('last5', 'Last 5 batches', last5Count, 'clock')}
                </>
              )}
              <p className="side-label">COLLECTIONS</p>
              {collectionRow('all', 'All icons', total, 'grid')}
              {index?.categories.map((c) => collectionRow(c.id, c.title, c.count))}
              <p className="side-label">YOUR LIBRARY</p>
              {collectionRow('favourites', 'Favourites', favourites.items.length, 'heart')}
              {collectionRow('recent', 'Recently used', recent.items.length, 'star')}
            </>
          ) : (
            <>
              <IllustrationSidebar s={ill} />
              <p className="side-label">YOUR LIBRARY</p>
              {collectionRow('favourites', 'Favourites', favourites.items.length, 'heart')}
              {collectionRow('recent', 'Recently used', recent.items.length, 'star')}
            </>
          )}
          </div>
          <div className="promo">
            <div>
              <p className="promo-title">Use it inside Figma</p>
              <p className="promo-text">Drag any icon or illustration straight onto your canvas.</p>
            </div>
            <a className="btn btn-primary btn-sm" href="#figma">
              <UiIcon name="arrow-up-right" size={16} />
              Install plugin
            </a>
          </div>
        </aside>

        <main className="main" id="main">
          {mode === 'icons' ? (
            <>
              <div className="compact-controls only-compact">
                {searchField('search-tablet only-tablet')}
                <div className="chip-scroll" role="group" aria-label="Collections">
                  <button className="chip" aria-pressed={collection === 'all'} onClick={() => setCollection('all')}>
                    All icons · {fmt(total)}
                  </button>
                  {latest > 0 && (
                    <button className="chip" aria-pressed={collection === 'latest'} onClick={() => setCollection('latest')}>
                      Batch {latest} · {fmt(latestCount)}
                    </button>
                  )}
                  {index?.categories.map((c) => (
                    <button
                      key={c.id}
                      className="chip"
                      aria-pressed={collection === c.id}
                      onClick={() => setCollection(c.id)}
                    >
                      {c.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="title-row">
                <div className="title">
                  <h1>{current}</h1>
                  <p className="only-desktop">
                    {animated
                      ? `${batchNote}${fmt(list.length)} icons with motion. Download as Lottie, .lottie, GIF or animated SVG`
                      : `${batchNote}${fmt(list.length)} icons${deferredQuery ? ` for “${deferredQuery}”` : ''}, every one in Light, Regular, Bold, Fill and Duotone`}
                  </p>
                  <p className="only-tablet">{batchNote}{fmt(list.length)} icons · 5 styles each</p>
                  <p className="only-phone result-count">{fmt(list.length)} icons · 5 styles</p>
                </div>
                {!animated && (
                <div className="segmented only-desktop" aria-label="View">
                  <span className="seg seg-sm" aria-selected="true">
                    <UiIcon name="grid" size={16} />
                    Grid
                  </span>
                </div>
                )}
                {!animated && (
                <div className="segmented segmented-tight only-desktop" role="radiogroup" aria-label="Tile size">
                  {(['S', 'M', 'L'] as TileSize[]).map((t) => (
                    <button
                      key={t}
                      role="radio"
                      aria-checked={tile === t}
                      aria-selected={tile === t}
                      className="seg seg-sm"
                      onClick={() => setTile(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                )}
                <button className="btn btn-outline btn-md only-tablet" onClick={() => setSheet('filters')}>
                  <UiIcon name="sliders" size={20} />
                  Filters
                </button>
                <button className="btn btn-outline btn-sm only-phone" onClick={() => setSheet('filters')}>
                  <UiIcon name="sliders" size={16} />
                  Filters
                </button>
                {sortSelect('only-wide')}
              </div>

              {animated ? (
              <div className="filter-bar only-desktop">
                {motionChips}
                <span className="divider" />
                {animatedSwitch}
                <span className="divider" />
                <span className="filter-label">Colour</span>
                {swatches}
                <span className="grow" />
                <span className="filter-label">Format</span>
                {formatSelect}
              </div>
              ) : (
              <div className="filter-bar only-desktop">
                <span className="filter-label">Style</span>
                {styleChips}
                <span className="divider" />
                {animatedSwitch}
                <span className="divider" />
                <span className="filter-label">Colour</span>
                {swatches}
                <span className="grow" />
                <span className="filter-label">Size</span>
                {sizeSelect}
              </div>
              )}

              <div ref={gridWrap}>
              <IconGrid
                icons={visible}
                svgs={svgs}
                motion={animated ? motion : null}
                autoplay={autoplay}
                colourHex={colourHex}
                tile={tile}
                copied={copied}
                onTile={onTile}
                loading={!index || !svgs}
                emptyLabel={
                  collection === 'favourites'
                    ? 'No favourites yet.'
                    : collection === 'recent'
                      ? 'Icons you copy will show up here.'
                      : `No icons match “${deferredQuery}”.`
                }
              />
              </div>
              <div ref={sentinel} aria-hidden="true" />

              {list.length > 0 && (
                <div className="load-more">
                  <span>
                    Showing {fmt(visible.length)} of {fmt(list.length)} {animated ? 'animated icons' : 'icons'}
                  </span>
                  {more && autoLoads >= AUTO_LOADS && (
                    <button
                      className="btn btn-outline btn-md"
                      onClick={() => {
                        setShown((v) => roundRows(v + page.current.size));
                        setAutoLoads(0);
                      }}
                    >
                      Load more
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <Illustrations
              s={ill}
              query={deferredQuery}
              searchField={searchField('search-tablet only-tablet')}
              openFilters={() => setSheet('filters')}
              onOpen={(t) => setDownload(t)}
              theme={theme}
            />
          )}
        </main>
      </div>

      </>
      )}

      {sheet && (
        <Sheet title={sheet === 'menu' ? 'Menu' : 'Filters'} onClose={() => setSheet(null)}>
          {sheet === 'filters' && mode === 'icons' ? (
            <div className="sheet-filters">
              <div className="sheet-group">{animatedSwitch}</div>
              {animated ? (
                <>
                  <div className="sheet-group">
                    <span className="filter-label">Motion</span>
                    {motionChips}
                  </div>
                  <div className="sheet-group sheet-row">
                    <span className="filter-label">Format</span>
                    {formatSelect}
                  </div>
                </>
              ) : (
                <div className="sheet-group">
                  <span className="filter-label">Style</span>
                  {styleChips}
                </div>
              )}
              <div className="sheet-group">
                <span className="filter-label">Colour</span>
                {swatches}
              </div>
              {!animated && (
                <div className="sheet-group sheet-row">
                  <span className="filter-label">Size</span>
                  {sizeSelect}
                </div>
              )}
              <div className="sheet-group sheet-row only-phone">
                <span className="filter-label">Sort</span>
                {sortSelect()}
              </div>
            </div>
          ) : sheet === 'filters' ? (
            <IllustrationFilters s={ill} site={theme} />
          ) : (
            <div className="sheet-menu">
              <a className="btn btn-ghost btn-md" href="#subscribe" aria-current={view === 'subscribe' ? 'page' : undefined}>
                Pricing
              </a>
              <a className="btn btn-ghost btn-md" href="#docs">
                Docs
              </a>
              <a className="btn btn-ghost btn-md" href="#figma">
                Figma plugin
              </a>
              {mode === 'icons' && (
                <>
                  <p className="side-label">YOUR LIBRARY</p>
                  {collectionRow('favourites', 'Favourites', favourites.items.length, 'heart')}
                  {collectionRow('recent', 'Recently used', recent.items.length, 'star')}
                </>
              )}
              <div className="sheet-actions">
                <a className="btn btn-outline btn-md" href="#signin">
                  Sign in
                </a>
                <a className="btn btn-primary btn-md" href="#pro" aria-current={view === 'pro' ? 'page' : undefined}>
                  <UiIcon name="sparkle" size={20} />
                  Get Pro
                </a>
              </div>
            </div>
          )}
        </Sheet>
      )}

      {download && (
        <DownloadModal
          target={download}
          theme={theme}
          opticalStroke={index?.tokens.icon.opticalStroke ?? {}}
          onClose={() => setDownload(null)}
          onToast={showToast}
          onFavourite={(n) => favourites.toggle(n)}
          isFavourite={(n) => favourites.items.includes(n)}
        />
      )}

      <div className="toast-region" role="status" aria-live="polite">
        {toast && (
          <div className="toast" key={toast.id}>
            <span className="toast-ok">
              <UiIcon name="check" size={16} strokeWidth={2} />
            </span>
            {toast.text}
          </div>
        )}
      </div>
    </div>
  );
}

function IconGrid({
  icons,
  svgs,
  motion,
  autoplay,
  colourHex,
  tile,
  copied,
  onTile,
  loading,
  emptyLabel,
}: {
  icons: IconEntry[];
  svgs: Record<string, string> | null;
  motion: Record<string, MotionSpec> | null;
  autoplay: boolean;
  colourHex: string;
  tile: TileSize;
  copied: string | null;
  onTile: (i: IconEntry) => void;
  loading: boolean;
  emptyLabel: string;
}) {
  const [hover, setHover] = useState<string | null>(null);
  if (loading) {
    return (
      <div className={`icon-grid tile-${tile}`} aria-busy="true">
        {Array.from({ length: 36 }, (_, i) => (
          <div key={i} className="icon-tile is-skeleton" />
        ))}
      </div>
    );
  }
  if (!icons.length) return <p className="empty">{emptyLabel}</p>;
  const px = TILE_ICON[tile];
  return (
    <ul className={`icon-grid tile-${tile}`} role="list">
      {icons.map((i) => {
        const svg = svgs?.[i.n];
        const spec = motion?.[i.n];
        const playing = spec && (autoplay || hover === i.n);
        return (
          <li key={i.n}>
            <button
              className={`icon-tile${copied === i.n ? ' is-copied' : ''}`}
              onClick={() => onTile(i)}
              title={i.t}
              aria-label={spec ? `${i.t}, open download options` : `Copy ${i.t} SVG`}
              style={{ color: colourHex, ['--px' as string]: `${px}px` }}
              onMouseEnter={spec ? () => setHover(i.n) : undefined}
              onMouseLeave={spec ? () => setHover(null) : undefined}
            >
              {svg && playing ? (
                // An <img> isolates each icon's keyframes from the others.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={svgDataUrl(animatedIconSvg(svg, spec, colourHex, px))} width={px} height={px} alt="" />
              ) : svg ? (
                <span className="icon-svg" dangerouslySetInnerHTML={{ __html: svg }} />
              ) : null}
              {copied === i.n && (
                <span className="tile-check" aria-hidden="true">
                  <UiIcon name="check" size={14} strokeWidth={2} />
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}



export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    ref.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="scrim" onClick={onClose}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={ref}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-head">
          <h2>{title}</h2>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>
            <UiIcon name="close" size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
