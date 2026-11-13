'use client';
// Download modal for animated icons and illustrations (Figma "Download Modal", 32:896;
// screens 35:6787 and 34:4844; phone sheet 37:9601). Static icons never open it: they copy.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ICON_STYLES,
  animatedIconSvg,
  loadIndex,
  loadMotion,
  loadIcons,
  nameSvg,
  svgDataUrl,
  type Category,
  type IconEntry,
  type IconStyle,
  type Illustration,
  type MotionSpec,
} from '@/lib/data';
import {
  BACKGROUNDS,
  illustrationSvg,
  type IllBackground,
  type IllMotion,
  type IllTheme,
} from '@/lib/illustration';
import type { Theme } from '@/lib/hooks';
import { drawSpec, stillSpec, toDotLottie, toGif, toLottie } from '@/lib/export';
import { UiIcon } from './ui-icons';
import { ANIM_FORMATS, SWATCHES, copyText, type AnimFormat } from './shared';

export type DownloadTarget =
  | { kind: 'icon'; icon: IconEntry; list: IconEntry[]; format: AnimFormat }
  | { kind: 'illustration'; item: Illustration; list: Illustration[]; categories: Category[] };

type Common = {
  theme: Theme;
  onClose: () => void;
  onToast: (t: string) => void;
  onFavourite: (n: string) => void;
  isFavourite: (n: string) => boolean;
};

const ILL_SWATCHES = [...SWATCHES.map((s) => (s.id === 'ink' ? { ...s, hex: '#141416' } : s)), { id: 'violet', label: 'Violet', hex: '#8E4EC6' }];
const pascal = (s: string) => s.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase());

export function DownloadModal({ target, ...rest }: { target: DownloadTarget; opticalStroke: Record<string, number | string> } & Common) {
  const [i, setI] = useState(() =>
    Math.max(0, target.kind === 'icon' ? target.list.indexOf(target.icon) : target.list.indexOf(target.item)),
  );
  const count = target.list.length;
  const go = useCallback((d: number) => setI((x) => (x + d + count) % count), [count]);
  const { onClose } = rest;
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    dialog.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      const t = e.target as HTMLElement;
      if (t.closest('input,select,textarea')) return;
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      prev?.focus?.();
    };
  }, [go, onClose]);

  const body =
    target.kind === 'icon' ? (
      <IconPanel icon={target.list[i]} index={i} count={count} go={go} initialFormat={target.format} {...rest} />
    ) : (
      <IllustrationPanel item={target.list[i]} index={i} count={count} go={go} categories={target.categories} {...rest} />
    );

  return (
    <div className="scrim modal-scrim" onClick={onClose}>
      <button className="modal-nav modal-prev" aria-label="Previous" onClick={(e) => (e.stopPropagation(), go(-1))}>
        <UiIcon name="chevron-left" size={20} />
      </button>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={target.kind === 'icon' ? 'Download animated icon' : 'Download illustration'}
        tabIndex={-1}
        ref={dialog}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="sheet-grip" aria-hidden="true" />
        {body}
      </div>
      <button className="modal-nav modal-next" aria-label="Next" onClick={(e) => (e.stopPropagation(), go(1))}>
        <UiIcon name="chevron-right" size={20} />
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------- shared bits */

function Top({ crumb, index, count, go, onClose }: { crumb: string; index: number; count: number; go: (d: number) => void; onClose: () => void }) {
  return (
    <div className="modal-top">
      <span className="crumb">{crumb}</span>
      <span className="pager only-wide">
        <button className="icon-btn icon-btn-sm" aria-label="Previous" onClick={() => go(-1)}>
          <UiIcon name="chevron-left" size={16} />
        </button>
        <span className="mono">
          {index + 1} / {count.toLocaleString('en-US')}
        </span>
        <button className="icon-btn icon-btn-sm" aria-label="Next" onClick={() => go(1)}>
          <UiIcon name="chevron-right" size={16} />
        </button>
      </span>
      <button className="icon-btn icon-btn-sm modal-close" aria-label="Close" onClick={onClose}>
        <UiIcon name="close" size={16} />
      </button>
    </div>
  );
}

function Seg<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: T;
  options: { id: T; label: string; off?: boolean }[];
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  return (
    <div className="mode-switch seg-fill" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          role="radio"
          aria-checked={value === o.id}
          aria-selected={value === o.id}
          className={`seg seg-md${o.off ? ' is-soon' : ''}`}
          disabled={disabled}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Row({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`cz-row ${className}`}>
      <span className="cz-label">{label}</span>
      {children}
    </div>
  );
}

function Swatches({
  list,
  value,
  onChange,
  custom,
  setCustom,
}: {
  list: { id: string; label: string; hex: string }[];
  value: string;
  onChange: (id: string) => void;
  custom: string;
  setCustom: (h: string) => void;
}) {
  return (
    <div className="swatches" role="radiogroup" aria-label="Colour">
      {list.map((s) => (
        <button
          key={s.id}
          role="radio"
          aria-checked={value === s.id}
          aria-label={s.label}
          className="swatch"
          style={{ ['--sw' as string]: s.id === 'ink' ? 'var(--color-asset-ink)' : s.hex }}
          onClick={() => onChange(s.id)}
        />
      ))}
      <label className="swatch swatch-rainbow" aria-label="Custom colour" aria-checked={value === 'custom'} role="radio">
        <input
          type="color"
          value={custom}
          onChange={(e) => {
            setCustom(e.target.value.toUpperCase());
            onChange('custom');
          }}
        />
      </label>
    </div>
  );
}

function Slider({ value, min, max, step, onChange, readout, label }: { value: number; min: number; max: number; step: number; onChange: (v: number) => void; readout: string; label: string }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <span className="slider">
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ['--pct' as string]: `${pct}%` }}
      />
      <span className="mono readout">{readout}</span>
    </span>
  );
}

function Backgrounds({ value, onChange }: { value: IllBackground; onChange: (v: IllBackground) => void }) {
  return (
    <div className="bg-swatches" role="radiogroup" aria-label="Background">
      {(Object.keys(BACKGROUNDS) as IllBackground[]).map((b) => (
        <button
          key={b}
          role="radio"
          aria-checked={value === b}
          aria-label={b === 'transparent' ? 'Transparent' : b === 'tint' ? 'Blue tint' : b[0].toUpperCase() + b.slice(1)}
          className={`bg-swatch bg-${b}`}
          onClick={() => onChange(b)}
        />
      ))}
    </div>
  );
}

/** True on the published preview page, where the artifact viewer blocks file downloads. */
const isPreview = () => typeof window !== 'undefined' && !!(window as unknown as { __OLLO__?: { preview?: boolean } }).__OLLO__?.preview;

/** Saves a file and returns the toast text. On the preview page it copies to the clipboard instead. */
type ViewerDownloads = { save(r: { filename: string; data: string | Blob }): Promise<{ status: string }> };
type ViewerClaude = { use?: (name: string) => Promise<unknown> };

async function save(name: string, data: string | Blob, type: string): Promise<string> {
  if (isPreview()) {
    // The artifact viewer saves files through its `downloads` capability (the page must declare it).
    const claude = (window as unknown as { claude?: ViewerClaude }).claude;
    const downloads = (await claude?.use?.('downloads').catch(() => null)) as ViewerDownloads | null | undefined;
    if (downloads) {
      // .lottie is not on the viewer's extension allowlist; a dotLottie file is a zip.
      const filename = name.endsWith('.lottie') ? `${name.slice(0, -7)}-dotlottie.zip` : name;
      try {
        await downloads.save({ filename, data });
        return filename === name ? `${name} saved` : `${filename} saved (rename it to .lottie)`;
      } catch (e) {
        const code = (e as { code?: string })?.code;
        if (code === 'declined') return 'Download cancelled';
        if (code === 'rate_limited') return 'A save is already waiting for you: finish it first';
      }
    }
    if (typeof data === 'string') {
      return (await copyText(data)) ? `Downloads are off in this preview: ${name} copied to clipboard` : 'Downloads are off in this preview';
    }
    if (type === 'image/png') {
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': data })]);
        return `Downloads are off in this preview: ${name} copied as an image`;
      } catch {}
    }
    return `Downloads are off in this preview. Run the site locally to save ${name}`;
  }
  download(name, data, type);
  return `${name} downloaded`;
}

function download(name: string, data: string | Blob, type: string) {
  const blob = typeof data === 'string' ? new Blob([data], { type }) : data;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function svgToPng(svg: string, px: number): Promise<Blob> {
  const img = new Image();
  img.src = svgDataUrl(svg);
  await img.decode();
  const c = document.createElement('canvas');
  c.width = c.height = px;
  c.getContext('2d')!.drawImage(img, 0, 0, px, px);
  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('png'))), 'image/png'));
}

/* ---------------------------------------------------------------- animated icon */

const MOTION_TEXT: Record<string, string> = {
  pop: 'pops in and settles',
  draw: 'draws itself on, then rests',
  wiggle: 'swings and settles',
  pulse: 'pulses gently',
};
const STROKES: { id: IconStyle; label: string }[] = ICON_STYLES.filter((s) => ['light', 'regular', 'bold'].includes(s.id));
const SIZES = [24, 32, 48, 64, 96] as const;
type Trigger = 'loop' | 'hover' | 'click';

function IconPanel({
  icon,
  index,
  count,
  go,
  initialFormat,
  theme,
  onClose,
  onToast,
  onFavourite,
  isFavourite,
}: { icon: IconEntry; index: number; count: number; go: (d: number) => void; initialFormat: AnimFormat } & Common) {
  const defaults = { colour: 'ink', stroke: 'regular' as IconStyle, size: 48, trigger: 'loop' as Trigger, speed: 1, bg: 'transparent' as IllBackground };
  const [colour, setColour] = useState(defaults.colour);
  const [custom, setCustom] = useState('#3A57FF');
  const [stroke, setStroke] = useState<IconStyle>(defaults.stroke);
  const [size, setSize] = useState<number>(defaults.size);
  const [trigger, setTrigger] = useState<Trigger>(defaults.trigger);
  const [speed, setSpeed] = useState(defaults.speed);
  const [bg, setBg] = useState<IllBackground>(defaults.bg);
  const [format, setFormat] = useState<AnimFormat>(initialFormat);
  const [svgs, setSvgs] = useState<Record<string, string> | null>(null);
  const [motion, setMotion] = useState<Record<string, MotionSpec> | null>(null);
  const [cats, setCats] = useState<Map<string, string>>(new Map());
  const [playKey, setPlayKey] = useState(0);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    let live = true;
    loadIcons([icon], stroke).then((d) => live && setSvgs(d));
    return () => {
      live = false;
    };
  }, [stroke, icon]);
  useEffect(() => {
    loadMotion().then(setMotion);
    loadIndex().then((d) => setCats(new Map(d.categories.map((c) => [c.id, c.title]))));
  }, []);

  const reset = () => {
    setColour(defaults.colour);
    setStroke(defaults.stroke);
    setSize(defaults.size);
    setTrigger(defaults.trigger);
    setSpeed(defaults.speed);
    setBg(defaults.bg);
  };

  const hex =
    colour === 'ink' ? (theme === 'dark' ? '#F4F4F5' : '#171729') : colour === 'custom' ? custom : SWATCHES.find((s) => s.id === colour)!.hex;
  const exportHex = colour === 'ink' ? '#171729' : hex;
  const spec = motion?.[icon.n];
  const timed = useMemo(
    () => (spec ? { ...spec, duration: Math.round(spec.duration / speed), loop: trigger === 'loop' } : null),
    [spec, speed, trigger],
  );
  const base = svgs?.[icon.n];

  const exportSvg = useCallback(() => {
    if (!base || !timed) return '';
    let svg = nameSvg(animatedIconSvg(base, timed, exportHex, size), icon.n);
    const bgHex = BACKGROUNDS[bg]?.light;
    if (bgHex) svg = svg.replace(/(<svg[^>]*>(?:<style>[\s\S]*?<\/style>)?)/, `$1<rect width="24" height="24" fill="${bgHex}"/>`);
    if (trigger === 'hover') {
      svg = svg.replace('</style>', '*{animation-play-state:paused}svg:hover *{animation-play-state:running}</style>');
    }
    return svg;
  }, [base, timed, exportHex, size, bg, trigger]);

  const preview = useMemo(() => {
    if (!base || !timed) return null;
    const run = trigger === 'loop' || (trigger === 'hover' && hovering) || trigger === 'click';
    if (!run) return { src: svgDataUrl(base.replace(/currentColor/g, hex)), still: true };
    return { src: svgDataUrl(animatedIconSvg(base, timed, hex)), still: false };
  }, [base, timed, hex, trigger, hovering]);

  const comp = `${pascal(icon.n)}Icon`;
  const react = `import { ${comp} } from '@library/react';\n\n<${comp} variant="${stroke}" size={${size}} color="${exportHex}" />`;
  const fmtLabel = ANIM_FORMATS.find((f) => f.id === format)!.label;
  const [busy, setBusy] = useState(false);
  const bgHex = BACKGROUNDS[bg]?.light ?? null;
  const lottie = () => toLottie(base!, spec!, { colour: exportHex, size, background: bgHex, speed, name: icon.n });
  const canCopy = format === 'svg' || format === 'lottie';
  const doCopy = async () => {
    const text = format === 'svg' ? exportSvg() : JSON.stringify(lottie());
    onToast((await copyText(text)) ? `${format === 'svg' ? 'Animated SVG' : 'Lottie JSON'} copied to clipboard` : 'Copy failed');
  };
  const doDownload = async () => {
    if (!base || !spec) return;
    let msg = '';
    if (format === 'svg') msg = await save(`${icon.n}-animated.svg`, exportSvg(), 'image/svg+xml');
    else if (format === 'lottie') msg = await save(`${icon.n}.json`, JSON.stringify(lottie()), 'application/json');
    else if (format === 'dotlottie') {
      const bytes = toDotLottie(lottie(), { id: icon.n, loop: trigger === 'loop', speed: 1 });
      msg = await save(`${icon.n}.lottie`, new Blob([bytes as BlobPart], { type: 'application/zip' }), 'application/zip');
    } else {
      setBusy(true);
      try {
        const svg = base.replace(/currentColor/g, exportHex);
        const gif = await toGif(svg, { ...spec, duration: spec.duration / speed }, { size: Math.max(size, 48) * 2, background: bgHex });
        msg = await save(`${icon.n}.gif`, gif, 'image/gif');
      } finally {
        setBusy(false);
      }
    }
    onToast(msg);
  };
  const fav = isFavourite(icon.n);
  const desc = `${icon.t} ${MOTION_TEXT[icon.m ?? 'pop']}. ${(timed ? timed.duration / 1000 : 3).toFixed(1).replace('.0', '')}s ${trigger === 'loop' ? 'loop' : 'animation'}, works in Lottie, GIF and animated SVG.`;

  return (
    <>
      <div className="modal-preview">
        <div
          className="canvas"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onClick={() => trigger === 'click' && setPlayKey((k) => k + 1)}
        >
          <button className="modal-nav-in modal-prev-in only-phone" aria-label="Previous" onClick={(e) => (e.stopPropagation(), go(-1))}>
            <UiIcon name="chevron-left" size={16} />
          </button>
          <div className={`stage bg-${bg}`}>
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={`${icon.n}-${playKey}`} src={preview.src} width={120} height={120} alt={icon.t} />
            )}
          </div>
          <button className="modal-nav-in modal-next-in only-phone" aria-label="Next" onClick={(e) => (e.stopPropagation(), go(1))}>
            <UiIcon name="chevron-right" size={16} />
          </button>
        </div>
      </div>
      <div className="modal-panel">
        <Top crumb={`${(cats.get(icon.c) ?? icon.c).toUpperCase()} / ANIMATED`} index={index} count={count} go={go} onClose={onClose} />
        <div className="modal-title">
          <h2>{icon.t}</h2>
          <p className="only-wide">{desc}</p>
        </div>
        <div className="customize">
          <div className="cz-head">
            <span>Customize</span>
            <button className="link" onClick={reset}>
              Reset
            </button>
          </div>
          <Row label="Colour">
            <Swatches list={SWATCHES} value={colour} onChange={setColour} custom={custom} setCustom={setCustom} />
          </Row>
          <Row label="Stroke" className="cz-seg">
            <Seg label="Stroke" value={stroke} options={STROKES} onChange={setStroke} />
          </Row>
          <Row label="Size" className="cz-seg">
            <Seg label="Size" value={String(size)} options={SIZES.map((s) => ({ id: String(s), label: String(s) }))} onChange={(v) => setSize(Number(v))} />
          </Row>
          <Row label="Trigger" className="cz-seg">
            <Seg
              label="Trigger"
              value={trigger}
              options={[
                { id: 'loop', label: 'Loop' },
                { id: 'hover', label: 'Hover' },
                { id: 'click', label: 'Click' },
              ]}
              onChange={setTrigger}
            />
          </Row>
          <Row label="Speed" className="only-wide-flex">
            <Slider label="Speed" value={speed} min={0.25} max={2} step={0.05} onChange={setSpeed} readout={`${speed.toFixed(1)}×`} />
          </Row>
          <Row label="Background" className="only-wide-flex">
            <Backgrounds value={bg} onChange={setBg} />
          </Row>
        </div>
        <div className="modal-secondary only-wide-flex">
          <button className="btn btn-outline btn-md" onClick={() => (onFavourite(icon.n), onToast(fav ? 'Removed from Favourites' : 'Added to Favourites'))}>
            <UiIcon name={fav ? 'check' : 'folder'} size={20} />
            {fav ? 'In collection' : 'Add to collection'}
          </button>
          <button className="btn btn-outline btn-md" onClick={async () => onToast((await copyText(react)) ? 'React code copied' : 'Copy failed')}>
            <UiIcon name="code" size={20} />
            Copy React code
          </button>
        </div>
        <div className="modal-grow" />
        <div className="modal-download">
          <Seg
            label="Format"
            value={format}
            options={ANIM_FORMATS}
            onChange={setFormat}
          />
          <div className="modal-actions">
            <button
              className="btn btn-outline btn-lg"
              disabled={!canCopy}
              title={canCopy ? undefined : `${fmtLabel} is a file: use Download`}
              onClick={doCopy}
            >
              <UiIcon name="copy" size={20} />
              Copy
            </button>
            <button className="btn btn-primary btn-lg" disabled={busy || !base || !spec} onClick={doDownload}>
              <UiIcon name="download" size={20} />
              {busy ? 'Rendering GIF…' : `Download ${fmtLabel}`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- illustration */

function IllustrationPanel({
  item,
  index,
  count,
  go,
  categories,
  theme: siteTheme,
  onClose,
  onToast,
  onFavourite,
  isFavourite,
}: { item: Illustration; index: number; count: number; go: (d: number) => void; categories: Category[] } & Common) {
  const defaults = { colour: 'ink', theme: siteTheme as IllTheme, type: 'stroke' as const, fill: 1, bg: 'transparent' as IllBackground };
  const [colour, setColour] = useState(defaults.colour);
  const [custom, setCustom] = useState('#3A57FF');
  const [theme, setTheme] = useState<IllTheme>(defaults.theme);
  const [type, setType] = useState<'stroke' | 'fill' | 'duotone'>(defaults.type);
  const [fill, setFill] = useState(defaults.fill);
  const [bg, setBg] = useState<IllBackground>(defaults.bg);
  const [format, setFormat] = useState<'svg' | 'png' | 'lottie'>('svg');
  const [motion, setMotion] = useState<IllMotion>('still');

  const reset = () => {
    setColour(defaults.colour);
    setTheme(defaults.theme);
    setType(defaults.type);
    setFill(defaults.fill);
    setBg(defaults.bg);
  };
  const hex = colour === 'ink' ? null : colour === 'custom' ? custom : ILL_SWATCHES.find((s) => s.id === colour)!.hex;
  const opts = { type, theme, colour: hex, fill, background: bg };
  const previewSvg = illustrationSvg(item, { ...opts, motion });
  const exportSvg = () => nameSvg(illustrationSvg(item, { ...opts, motion: format === 'png' ? 'still' : motion }), item.n);
  const cat = categories.find((c) => c.id === item.c)?.title ?? item.c;
  const fav = isFavourite(`ill:${item.n}`);
  const comp = `${pascal(item.n)}Illustration`;
  const ink = hex ?? (theme === 'dark' ? '#F4F4F5' : '#141416');
  const react = `import { ${comp} } from '@library/react';\n\n<${comp} type="${type}" ink="${ink}" primary="${ink}" />`;
  const fmtLabel = format === 'svg' ? 'SVG' : format === 'png' ? 'PNG' : 'Lottie';
  const illLottie = () => {
    const svg = illustrationSvg(item, { ...opts, motion: 'still' });
    const spec = motion === 'float' && item.motion ? item.motion : motion === 'draw' ? drawSpec(svg) : stillSpec;
    return toLottie(svg, spec, { name: item.n });
  };
  const desc = item.g ? `${item.t} scene, isometric. Tags: ${item.g.split(' ').slice(0, 4).join(', ')}.` : `${item.t} scene, isometric.`;

  const doDownload = async () => {
    if (format === 'lottie') {
      onToast(await save(`${item.n}.json`, JSON.stringify(illLottie()), 'application/json'));
    } else if (format === 'png') {
      onToast(await save(`${item.n}.png`, await svgToPng(exportSvg(), 1040), 'image/png'));
    } else {
      onToast(await save(`${item.n}${motion === 'still' ? '' : `-${motion}`}.svg`, exportSvg(), 'image/svg+xml'));
    }
  };
  const doCopy = async () => {
    if (format === 'lottie') {
      onToast((await copyText(JSON.stringify(illLottie()))) ? 'Lottie JSON copied to clipboard' : 'Copy failed');
      return;
    }
    if (format === 'png') {
      try {
        const blob = await svgToPng(exportSvg(), 1040);
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        onToast('PNG copied to clipboard');
      } catch {
        onToast('Copy failed: clipboard is blocked in this browser');
      }
      return;
    }
    onToast((await copyText(exportSvg())) ? 'SVG copied to clipboard' : 'Copy failed');
  };

  return (
    <>
      <div className="modal-preview">
        <div className={`canvas ill-canvas theme-${theme}`}>
          <button className="modal-nav-in modal-prev-in only-phone" aria-label="Previous" onClick={() => go(-1)}>
            <UiIcon name="chevron-left" size={16} />
          </button>
          <div className="ill-stage">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={svgDataUrl(previewSvg)} alt={item.t} />
          </div>
          <button className="modal-nav-in modal-next-in only-phone" aria-label="Next" onClick={() => go(1)}>
            <UiIcon name="chevron-right" size={16} />
          </button>
        </div>
      </div>
      <div className="modal-panel">
        <Top crumb={`${cat.toUpperCase()} / SCENE`} index={index} count={count} go={go} onClose={onClose} />
        <div className="modal-title">
          <h2>{item.t}</h2>
          <p className="only-wide">{desc}</p>
        </div>
        <div className="customize">
          <div className="cz-head">
            <span>Customize</span>
            <button className="link" onClick={reset}>
              Reset
            </button>
          </div>
          <Row label="Colour">
            <Swatches list={ILL_SWATCHES} value={colour} onChange={setColour} custom={custom} setCustom={setCustom} />
          </Row>
          <Row label="Theme" className="cz-seg cz-theme">
            <Seg
              label="Theme"
              value={theme}
              options={[
                { id: 'light', label: 'Light' },
                { id: 'dark', label: 'Dark' },
              ]}
              onChange={setTheme}
            />
          </Row>
          <Row label="Style" className="cz-seg">
            <Seg
              label="Style"
              value={type}
              options={[
                { id: 'stroke', label: 'Stroke' },
                { id: 'fill', label: 'Fill' },
                { id: 'duotone', label: 'Duotone' },
              ]}
              onChange={setType}
            />
          </Row>
          <Row label="Fill" className="only-wide-flex">
            <Slider label="Fill" value={fill} min={0} max={1} step={0.01} onChange={setFill} readout={`${Math.round(fill * 100)}%`} />
          </Row>
          <Row label="Background" className="only-wide-flex">
            <Backgrounds value={bg} onChange={setBg} />
          </Row>
        </div>
        <div className="modal-secondary only-wide-flex">
          <button
            className="btn btn-outline btn-md"
            onClick={() => (onFavourite(`ill:${item.n}`), onToast(fav ? 'Removed from Favourites' : 'Added to Favourites'))}
          >
            <UiIcon name={fav ? 'check' : 'folder'} size={20} />
            {fav ? 'In collection' : 'Add to collection'}
          </button>
          <button className="btn btn-outline btn-md" onClick={async () => onToast((await copyText(react)) ? 'React code copied' : 'Copy failed')}>
            <UiIcon name="code" size={20} />
            Copy React code
          </button>
        </div>
        <div className="modal-grow" />
        <div className="modal-download">
          <Seg
            label="Format"
            value={format}
            options={[
              { id: 'svg', label: 'SVG' },
              { id: 'png', label: 'PNG' },
              { id: 'lottie', label: 'Lottie' },
            ]}
            onChange={setFormat}
          />
          <Seg
            label="Motion"
            value={motion}
            options={[
              { id: 'still', label: 'Still' },
              { id: 'draw', label: 'Draw' },
              { id: 'float', label: 'Float' },
            ]}
            onChange={setMotion}
          />
          <div className="modal-actions">
            <button className="btn btn-outline btn-lg" onClick={doCopy}>
              <UiIcon name="copy" size={20} />
              Copy
            </button>
            <button className="btn btn-primary btn-lg" onClick={doDownload}>
              <UiIcon name="download" size={20} />
              Download {fmtLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
