'use client';
// "Create your own" (illustrations toolbar): a user describes a scene the library doesn't have yet and
// picks the look. The concept is kept in their browser; prompt-to-illustration drawing (Hairline,
// server side) is not connected yet, so the panel says so and shows the closest figures we already have.
import { useEffect, useMemo, useRef, useState } from 'react';
import { searchIcons, svgDataUrl, type Category, type Illustration } from '@/lib/data';
import { illustrationSvg, type IllTheme } from '@/lib/illustration';
import { Roll } from '@/lib/motion';
import { LiveIllustration } from './LiveIllustration';
import { UiIcon } from './ui-icons';

type Look = 'stroke' | 'fill' | 'duotone';
type Motion = 'still' | 'animated' | 'interactive' | 'scroll';
type Concept = { id: string; prompt: string; look: Look; motion: Motion; industry: string; at: number };

const KEY = 'ollo.concepts';
const MAX = 280;
const EXAMPLES = [
  'A barista handing a coffee cup across a counter',
  'A robot arm sorting parcels on a conveyor',
  'A plant shop till with a card reader',
  'Solar panels charging an electric scooter',
];
const STEPS = ['Reading your idea', 'Blocking out the shapes', 'Matching the ollo line style'];

const loadConcepts = (): Concept[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
};
const saveConcepts = (l: Concept[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(l.slice(0, 12)));
  } catch {}
};

export function CreateConcept({
  items,
  categories,
  theme,
  onClose,
  onPick,
}: {
  items: Illustration[];
  categories: Category[];
  theme: IllTheme;
  onClose: () => void;
  onPick: (item: Illustration) => void;
}) {
  const [prompt, setPrompt] = useState('');
  const [look, setLook] = useState<Look>('stroke');
  const [motion, setMotion] = useState<Motion>('animated');
  const [industry, setIndustry] = useState('any');
  const [phase, setPhase] = useState<'idle' | 'working' | 'done'>('idle');
  const [step, setStep] = useState(0);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [asked, setAsked] = useState('');
  const box = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setConcepts(loadConcepts());
    box.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  // Closest figures already in the library for what was asked (same search as the library).
  const titles = useMemo(() => new Map(categories.map((c) => [c.id, c.title])), [categories]);
  const matches = useMemo(() => {
    if (!asked) return [];
    const pool = industry === 'any' ? items : items.filter((i) => i.c === industry);
    const words = asked.toLowerCase().match(/[a-z]{3,}/g) ?? [];
    const seen = new Set<string>();
    const out: Illustration[] = [];
    for (const q of [asked, ...words]) {
      for (const it of searchIcons(pool, q, titles)) {
        if (seen.has(it.n)) continue;
        seen.add(it.n);
        out.push(it);
        if (out.length >= 6) return out;
      }
    }
    return out;
  }, [asked, industry, items, titles]);

  const sample = useMemo(() => items.find((i) => i.live && i.c === 'office') ?? items.find((i) => i.live), [items]);
  const hero = matches.find((m) => m.live) ?? sample;

  const create = () => {
    const p = prompt.trim();
    if (!p || phase === 'working') return;
    const c: Concept = { id: Math.random().toString(36).slice(2, 9), prompt: p, look, motion, industry, at: Date.now() };
    const next = [c, ...concepts.filter((x) => x.prompt !== p)];
    setConcepts(next);
    saveConcepts(next);
    setAsked(p);
    setPhase('working');
    setStep(0);
  };
  useEffect(() => {
    if (phase !== 'working') return;
    if (step >= STEPS.length) return setPhase('done');
    const t = setTimeout(() => setStep((s) => s + 1), 650);
    return () => clearTimeout(t);
  }, [phase, step]);

  const reuse = (c: Concept) => {
    setPrompt(c.prompt);
    setLook(c.look);
    setMotion(c.motion);
    setIndustry(c.industry);
    setAsked(c.prompt);
    setPhase('done');
  };
  const remove = (id: string) => {
    const next = concepts.filter((c) => c.id !== id);
    setConcepts(next);
    saveConcepts(next);
  };

  const liveMode = motion === 'still' ? null : motion;

  return (
    <div className="scrim modal-scrim" onClick={onClose}>
      <div className="modal create-modal" role="dialog" aria-modal="true" aria-label="Create your own illustration" onClick={(e) => e.stopPropagation()}>
        <div className="modal-preview">
          <div className={`canvas create-canvas is-${phase}`}>
            {phase === 'idle' && (
              <div className="create-empty">
                <span className="create-orb" aria-hidden="true">
                  <UiIcon name="sparkle" size={28} />
                </span>
                <b>Your concept appears here</b>
                <span>Describe a scene on the right. Every concept follows the ollo isometric line style.</span>
              </div>
            )}
            {phase === 'working' && (
              <div className="create-working" aria-live="polite">
                <div className="create-sketch" aria-hidden="true">
                  {sample && <LiveIllustration key="sketch" name={sample.n} mode="animated" style="stroke" theme={theme} colour={null} tags={false} />}
                </div>
                <ol className="create-steps">
                  {STEPS.map((s, i) => (
                    <li key={s} className={i < step ? 'is-done' : i === step ? 'is-now' : undefined}>
                      <span className="create-step-dot">{i < step ? <UiIcon name="check" size={12} strokeWidth={2.5} /> : null}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {phase === 'done' && (
              <div className="create-result">
                <div className="create-result-stage">
                  {hero &&
                    (liveMode && hero.live ? (
                      <LiveIllustration key={hero.n + look + liveMode} name={hero.n} mode={liveMode} style={look} theme={theme} colour={null} />
                    ) : (
                      <img alt={hero.t} src={svgDataUrl(illustrationSvg(hero, { type: look, theme, colour: null }))} />
                    ))}
                </div>
                <p className="create-note">
                  <UiIcon name="info" size={16} />
                  <span>
                    <b>Drawing from a prompt is coming soon.</b> Your concept is saved below. Until then, this is the closest
                    figure already in the library.
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="modal-panel create-panel">
          <div className="modal-top">
            <span className="crumb">CREATE · BETA</span>
            <button className="icon-btn icon-btn-sm modal-close" aria-label="Close" onClick={onClose}>
              <UiIcon name="close" size={20} />
            </button>
          </div>
          <div className="modal-title">
            <h2>Create your own illustration</h2>
            <p>Can’t find the scene you need? Describe it and choose the look. It’s drawn in the same hand-built line style as the library.</p>
          </div>

          <label className="create-prompt">
            <span className="cz-label">Your idea</span>
            <textarea
              ref={box}
              className="field-input"
              rows={4}
              maxLength={MAX}
              value={prompt}
              placeholder="e.g. A courier scanning a parcel at a front door"
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => (e.key === 'Enter' && (e.metaKey || e.ctrlKey) ? create() : undefined)}
            />
            <span className="create-count">
              {prompt.length}/{MAX}
            </span>
          </label>
          <div className="create-examples">
            <span>Try</span>
            {EXAMPLES.map((x) => (
              <button key={x} className="chip" onClick={() => setPrompt(x)}>
                {x}
              </button>
            ))}
          </div>

          <div className="customize">
            <div className="cz-row">
              <span className="cz-label">Look</span>
              <Seg label="Look" value={look} onChange={setLook} options={[['stroke', 'Stroke'], ['fill', 'Fill'], ['duotone', 'Duotone']]} />
            </div>
            <div className="cz-row">
              <span className="cz-label">Motion</span>
              <Seg label="Motion" value={motion} onChange={setMotion} options={[['still', 'Still'], ['animated', 'Animated'], ['interactive', 'Live'], ['scroll', 'Scroll']]} />
            </div>
            <div className="cz-row">
              <span className="cz-label">Industry</span>
              <select className="field-input create-select" value={industry} onChange={(e) => setIndustry(e.target.value)} aria-label="Industry">
                <option value="any">Any industry</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className="btn btn-primary btn-lg btn-block btn-shine" disabled={!prompt.trim() || phase === 'working'} onClick={create}>
            <UiIcon name="sparkle" size={18} />
            <Roll text={phase === 'working' ? 'Creating…' : 'Create concept'} />
          </button>

          {phase === 'done' && matches.length > 1 && (
            <div className="create-section">
              <span className="filter-label">Closest in the library</span>
              <div className="create-matches">
                {matches.slice(0, 6).map((m) => (
                  <button key={m.n} className="create-match" onClick={() => onPick(m)} title={m.t}>
                    <img alt="" src={svgDataUrl(illustrationSvg(m, { type: look, theme, colour: null }))} />
                    <span>{m.t}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {concepts.length > 0 && (
            <div className="create-section">
              <span className="filter-label">Your concepts</span>
              <ul className="create-list" role="list">
                {concepts.map((c) => (
                  <li key={c.id}>
                    <button className="create-concept" onClick={() => reuse(c)}>
                      <b>{c.prompt}</b>
                      <span>
                        {c.look[0].toUpperCase() + c.look.slice(1)} · {c.motion === 'interactive' ? 'Live' : c.motion[0].toUpperCase() + c.motion.slice(1)} · saved
                      </span>
                    </button>
                    <button className="icon-btn icon-btn-sm" aria-label={`Remove “${c.prompt}”`} onClick={() => remove(c.id)}>
                      <UiIcon name="close" size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Seg<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: [T, string][] }) {
  return (
    <div className="mode-switch seg-fill" role="radiogroup" aria-label={label}>
      {options.map(([id, l]) => (
        <button key={id} role="radio" aria-checked={value === id} aria-selected={value === id} className="seg seg-md" onClick={() => onChange(id)}>
          {l}
        </button>
      ))}
    </div>
  );
}
