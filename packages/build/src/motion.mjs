// Compiles a motion spec (packages/assets/schema/motion.schema.json) to a self-contained,
// CSS-animated SVG. The same spec will feed the Lottie / GIF exporters.
//
// Targets: 'root' wraps the whole artwork in <g class="m-root">; a number is the n-th
// <path> of the icon; a string is an illustration part (<g data-part="...">).

const EASES = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.42,0,1,1)',
  easeOut: 'cubic-bezier(0,0,0.58,1)',
  easeInOut: 'cubic-bezier(0.42,0,0.58,1)',
};
const ease = (e) => (Array.isArray(e) ? `cubic-bezier(${e.join(',')})` : EASES[e] ?? 'linear');
const pct = (t) => `${+(t * 100).toFixed(3)}%`;
const cls = (target) => (target === 'root' ? 'm-root' : typeof target === 'number' ? `m-p${target}` : `m-${target}`);

function declarations(prop, v, v2) {
  switch (prop) {
    case 'scale': return `scale:${v}`;
    case 'rotate': return `rotate:${v}deg`;
    case 'translate': return `translate:${v}px ${v2}px`;
    case 'opacity': return `opacity:${v}`;
    case 'draw': return `stroke-dashoffset:${+(1 - v).toFixed(4)};stroke-opacity:${v > 0 ? 1 : 0}`;
  }
  throw new Error(`unknown motion property ${prop}`);
}

/** Merge translateX/translateY on the same target into one `translate` track. */
function normalise(tracks) {
  const out = [];
  const tx = new Map();
  for (const t of tracks) {
    if (t.property !== 'translateX' && t.property !== 'translateY') { out.push(t); continue; }
    const key = String(t.target);
    const cur = tx.get(key) ?? { target: t.target, property: 'translate', times: t.times, ease: t.ease };
    if (cur.x || cur.y) {
      if (JSON.stringify(cur.times) !== JSON.stringify(t.times)) throw new Error(`translateX/Y on ${key} must share times`);
    }
    cur[t.property === 'translateX' ? 'x' : 'y'] = t.values;
    tx.set(key, cur);
  }
  for (const t of tx.values()) {
    const zeros = t.times.map(() => 0);
    out.push({ ...t, values: t.x ?? zeros, values2: t.y ?? zeros });
  }
  return out;
}

export function compileCss(spec, { prefix = 'k' } = {}) {
  const dur = `${spec.duration}ms`;
  const iter = spec.loop === false ? '1' : 'infinite';
  const frames = [];
  const byTarget = new Map();
  normalise(spec.tracks).forEach((t, i) => {
    const name = `${prefix}${i}`;
    const steps = t.times.map((time, j) => {
      const e = j < t.times.length - 1 ? `animation-timing-function:${ease(t.ease?.[j] ?? 'linear')};` : '';
      return `${pct(time)}{${declarations(t.property, t.values[j], t.values2?.[j])};${e}}`;
    });
    frames.push(`@keyframes ${name}{${steps.join('')}}`);
    const c = cls(t.target);
    const entry = byTarget.get(c) ?? { anims: [], origin: t.origin, draw: false, root: t.target === 'root' };
    entry.anims.push(`${name} ${dur} ${iter} both`);
    if (t.origin) entry.origin = t.origin;
    if (t.property === 'draw') entry.draw = true;
    byTarget.set(c, entry);
  });
  const rules = [...byTarget].map(([c, e]) => {
    const [ox, oy] = e.origin ?? [50, 50];
    const box = e.root ? 'view-box' : 'fill-box';
    const sel = e.draw ? `.${c},.${c} path` : `.${c}`;
    return `${sel}{transform-box:${box};transform-origin:${ox}% ${oy}%;animation:${e.anims.join(',')}}` +
      (e.draw ? `.${c}[pathLength],.${c} path{stroke-dasharray:1 1}` : '');
  });
  return [...frames, ...rules, '@media (prefers-reduced-motion:reduce){*{animation:none!important}}'].join('');
}

/** Tag targets in the SVG markup and inject the <style>. */
export function animateSvg(svg, spec) {
  const targets = new Set(spec.tracks.map((t) => t.target));
  const drawTargets = new Set(spec.tracks.filter((t) => t.property === 'draw').map((t) => t.target));
  let out = svg;
  // numbered paths
  let i = -1;
  out = out.replace(/<path\b/g, (m) => {
    i++;
    if (!targets.has(i)) return m;
    return `<path class="${cls(i)}"${drawTargets.has(i) ? ' pathLength="1"' : ''}`;
  });
  // illustration parts
  out = out.replace(/<g data-part="([^"]+)"([^>]*)>([\s\S]*?)<\/g>/g, (m, part, rest, inner) => {
    if (!targets.has(part)) return m;
    const body = drawTargets.has(part) ? inner.replace(/<path\b/g, '<path pathLength="1"') : inner;
    return `<g data-part="${part}" class="${cls(part)}"${rest}>${body}</g>`;
  });
  const { attrs, body } = (() => {
    const m = out.match(/^<svg([^>]*)>([\s\S]*)<\/svg>\s*$/);
    return { attrs: m[1], body: m[2] };
  })();
  const css = compileCss(spec);
  const inner = targets.has('root') ? `<g class="m-root">${body}</g>` : body;
  return `<svg${attrs} overflow="visible"><style>${css}</style>${inner}</svg>`;
}
