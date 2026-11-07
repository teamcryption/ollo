// Generates dist/preview.html: a single-file review page for the built assets.
// It renders the pipeline OUTPUT (tokenised SVGs, optical sizes, compiled animations),
// so it is a check on the build, not on Figma.
import fs from 'node:fs';
import { iconAtSize } from './svg.mjs';

export function writePreview(manifest, file) {
  const { tokens } = manifest;
  const data = {
    tokens,
    icons: manifest.icons.map((i) => ({
      name: i.name, title: i.title, category: i.category, tags: i.tags,
      markup: i.markup,
      sized: Object.fromEntries(Object.entries(i.markup).map(([s, svg]) => [s, Object.fromEntries(tokens.icon.sizes.map((z) => [z, iconAtSize(svg, z, tokens)]))])),
      animated: i.animatedMarkup, motionSource: i.animation?.source ?? null, notes: i.notes ?? null,
    })),
    illustrations: manifest.illustrations.map((i) => ({
      name: i.name, title: i.title, category: i.category, tags: i.tags, parts: i.parts,
      templates: i.templates, animated: i.animatedTemplates, motionSource: i.animation?.source ?? null,
    })),
  };
  const html = TEMPLATE.replace('__DATA__', JSON.stringify(data).replace(/</g, '\\u003c'))
    .replace('__STAMP__', new Date(manifest.generatedAt).toUTCString());
  fs.writeFileSync(file, html);
}

const TEMPLATE = String.raw`<title>Library Asset Review</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=Figtree:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
/* Layout: a working review sheet - sticky control bar, then specimen grids laid on a 24px-grid motif. */
:root{
  --bg:#F6F6FB; --surface:#FFFFFF; --line:#E3E2EE; --muted:#6C6A80; --fg:#171729;
  --accent:#6B54F5; --accent-soft:#ECE9FE; --warn:#9A5B00; --warn-soft:#FFF3DD;
  --grid:rgba(107,84,245,.07);
  --f-display:"Bricolage Grotesque", "Figtree", system-ui, sans-serif;
  --f-body:"Figtree", system-ui, -apple-system, "Segoe UI", sans-serif;
  --f-mono:"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){
  --bg:#12121C; --surface:#1B1B28; --line:#2E2D40; --muted:#A3A1B8; --fg:#ECEBF7;
  --accent:#9C8CFF; --accent-soft:#2A2550; --warn:#F2B562; --warn-soft:#3A2C12; --grid:rgba(156,140,255,.08); color-scheme:dark}}
:root[data-theme="dark"]{
  --bg:#12121C; --surface:#1B1B28; --line:#2E2D40; --muted:#A3A1B8; --fg:#ECEBF7;
  --accent:#9C8CFF; --accent-soft:#2A2550; --warn:#F2B562; --warn-soft:#3A2C12; --grid:rgba(156,140,255,.08); color-scheme:dark}
*{box-sizing:border-box}
body{background:var(--bg);color:var(--fg);font:15px/1.5 var(--f-body);margin:0}
.wrap{max-width:1180px;margin:0 auto;padding-block:28px 64px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:grid;gap:40px}
h1,h2{font-family:var(--f-display);text-wrap:balance;margin:0;letter-spacing:-.01em}
h1{font-size:clamp(28px,4vw,40px);font-weight:700}
h2{font-size:22px;font-weight:700}
.lede{color:var(--muted);max-width:68ch;margin:6px 0 0}
.eyebrow{font:500 11px/1 var(--f-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.head{display:grid;gap:10px}
.stats{display:flex;flex-wrap:wrap;gap:8px 20px;font:13px var(--f-mono);color:var(--muted)}
.stats b{color:var(--fg);font-weight:500}
body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:10;background:var(--bg)}
.bar{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--line);padding-block:10px;display:flex;flex-wrap:wrap;gap:10px 18px;align-items:center}
.ctl{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--muted)}
.seg{display:inline-flex;border:1px solid var(--line);border-radius:8px;overflow:hidden;background:var(--surface)}
.seg button{font:500 13px var(--f-body);border:0;background:none;color:var(--fg);padding:6px 10px;cursor:pointer}
.seg button+button{border-left:1px solid var(--line)}
.seg button[aria-pressed="true"]{background:var(--accent);color:#fff}
input[type=color]{width:32px;height:28px;border:1px solid var(--line);border-radius:6px;padding:2px;background:var(--surface);cursor:pointer}
button:focus-visible,input:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
section{display:grid;gap:16px}
.sec-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:8px}
.matrix{overflow-x:auto;background:var(--surface);border:1px solid var(--line);border-radius:12px}
table{border-collapse:collapse;width:100%;min-width:720px}
th,td{padding:14px 10px;text-align:center}
thead th{font:500 12px var(--f-body);color:var(--muted);border-bottom:1px solid var(--line)}
tbody th{text-align:left;font:500 13px var(--f-body);white-space:nowrap;padding-left:18px}
tbody th small{display:block;font:11px var(--f-mono);color:var(--muted)}
tbody tr+tr td,tbody tr+tr th{border-top:1px dashed var(--line)}
.cell{display:inline-grid;place-items:center;width:56px;height:56px;border-radius:10px;border:0;background:none;color:var(--ic,var(--fg));cursor:pointer;
  background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);background-size:8px 8px;background-position:center}
.cell:hover{background-color:var(--accent-soft)}
.cell svg{display:block}
.anim{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:12px}
.tile{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:16px 12px 12px;display:grid;justify-items:center;gap:10px}
.tile .art{width:56px;height:56px;display:grid;place-items:center;color:var(--ic,var(--fg))}
.tile .art img{width:48px;height:48px}
.tag{font:11px var(--f-mono);color:var(--muted);display:flex;gap:6px;align-items:center}
.pill{font:500 10px/1 var(--f-mono);letter-spacing:.04em;text-transform:uppercase;padding:4px 6px;border-radius:999px;background:var(--accent-soft);color:var(--accent)}
.pill.warn{background:var(--warn-soft);color:var(--warn)}
.ills{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:12px;overflow:hidden;display:grid}
.card .art{aspect-ratio:1;max-width:100%;display:grid;place-items:center}
.card .art img,.card .art svg{width:100%;height:auto;display:block}
.card .meta{padding:12px 14px;display:flex;justify-content:space-between;align-items:center;gap:8px;border-top:1px solid var(--line)}
.card .meta b{font-weight:600}
.copy{font:500 12px var(--f-body);border:1px solid var(--line);background:var(--surface);color:var(--fg);border-radius:6px;padding:5px 9px;cursor:pointer}
.copy:hover{border-color:var(--accent);color:var(--accent)}
.notes{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:18px 20px;display:grid;gap:10px}
.notes ol{margin:0;padding-left:20px;display:grid;gap:8px;max-width:80ch}
code{font:13px var(--f-mono);background:var(--accent-soft);padding:1px 5px;border-radius:4px}
.toast{position:fixed;left:50%;bottom:calc(20px + env(safe-area-inset-bottom,0px));translate:-50% 0;background:var(--fg);color:var(--bg);font:500 13px var(--f-body);padding:8px 14px;border-radius:8px;opacity:0;transition:opacity .2s;pointer-events:none}
.toast.on{opacity:1}
@media (prefers-reduced-motion:reduce){.toast{transition:none}}
</style>

<div class="wrap">
  <header class="head">
    <span class="eyebrow">Step 1 · pipeline output review</span>
    <h1>Library asset review</h1>
    <p class="lede">Everything below is rendered from the build output, not from Figma: cleaned and tokenised SVGs, the optical stroke per size, and the animations compiled from the motion spec. Click any icon or use Copy SVG to grab the exact markup the pipeline ships.</p>
    <div class="stats" id="stats"></div>
  </header>

  <div class="bar" role="toolbar" aria-label="Preview controls">
    <div class="ctl">Size <span class="seg" id="sizes"></span></div>
    <div class="ctl"><label for="icol">Icon colour</label><input type="color" id="icol"></div>
    <div class="ctl">Illustration <span class="seg" id="itype"></span></div>
    <div class="ctl"><label for="ipri">Primary</label><input type="color" id="ipri"><label for="isec">Secondary</label><input type="color" id="isec"></div>
    <div class="ctl">Motion <span class="seg" id="motion"></span></div>
    <div class="ctl"><button class="copy" id="reset">Reset colours</button></div>
  </div>

  <section aria-labelledby="h-icons">
    <div class="sec-head"><h2 id="h-icons">Icons</h2><span class="eyebrow" id="sizeNote"></span></div>
    <div class="matrix"><table id="matrix"></table></div>
  </section>

  <section aria-labelledby="h-anim">
    <div class="sec-head"><h2 id="h-anim">Animated icons</h2><span class="eyebrow">CSS-animated SVG · 3s loop</span></div>
    <div class="anim" id="anim"></div>
  </section>

  <section aria-labelledby="h-ill">
    <div class="sec-head"><h2 id="h-ill">Illustrations</h2><span class="eyebrow">260 × 260 · isometric 30°</span></div>
    <div class="ills" id="ills"></div>
  </section>

  <section aria-labelledby="h-notes">
    <h2 id="h-notes">Needs your call</h2>
    <div class="notes">
      <ol>
        <li><b>Secondary colour.</b> The brief says <code>illustration/secondary</code> is #C6BDFF, but the Figma variable (and every duotone export) is #AC9FFF. The build uses the Figma value. Which one is right?</li>
        <li><b>Lock icon.</b> The Figma lock is drawn open (shackle lifted on one side). Should the base icon be closed, with "unlocked" as its own icon?</li>
        <li><b>Optical stroke.</b> At each size the stroke is multiplied by 1.25 (16px), 1.1 (20px), 1 (24px), 0.875 (32px). These are my starting numbers, not from the brief. Flip the size switcher to judge.</li>
        <li><b>Approximated motion.</b> Mail, chat and folder animations, and all five illustration animations, are written from the brief because their keyframes didn't export. They're tagged "approx" below and will be replaced with the Figma keyframes.</li>
      </ol>
    </div>
  </section>
  <p class="eyebrow">Built __STAMP__</p>
</div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>

<script>
const D = __DATA__;
const T = D.tokens;
const STYLES = ['light','regular','bold','duotone','fill'];
const TYPES = ['stroke','fill','duotone'];
const st = { motion: 'on', size: 24, icol: null, type: 'duotone', pri: T.illustration.primary, sec: T.illustration.secondary };
const $ = (id) => document.getElementById(id);
const esc = (s) => s.replace(/[&<>"]/g, (c) => '&#' + c.charCodeAt(0) + ';');

function seg(el, values, key, fmt) {
  el.innerHTML = values.map((v) => '<button type="button" data-v="' + v + '">' + (fmt ? fmt(v) : v) + '</button>').join('');
  el.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; st[key] = isNaN(+b.dataset.v) ? b.dataset.v : +b.dataset.v; render(); });
}
seg($('sizes'), T.icon.sizes, 'size', (v) => v + 'px');
seg($('itype'), TYPES, 'type', (v) => v[0].toUpperCase() + v.slice(1));
seg($('motion'), ['on','off'], 'motion', (v) => v === 'on' ? 'On' : 'Off');
$('icol').value = T.icon.primary; $('ipri').value = st.pri; $('isec').value = st.sec;
$('icol').addEventListener('input', (e) => { st.icol = e.target.value; document.documentElement.style.setProperty('--ic', st.icol); renderAnim(); });
$('ipri').addEventListener('input', (e) => { st.pri = e.target.value; renderIlls(); });
$('isec').addEventListener('input', (e) => { st.sec = e.target.value; renderIlls(); });
$('reset').addEventListener('click', () => { st.icol = null; st.pri = T.illustration.primary; st.sec = T.illustration.secondary; $('icol').value = T.icon.primary; $('ipri').value = st.pri; $('isec').value = st.sec; document.documentElement.style.setProperty('--ic', st.icol); render(); });

function fill(tpl) { return tpl.replace(/\{\{(\w+)\}\}/g, (m, k) => ({ primary: st.pri, secondary: st.sec, background: T.illustration.background, ink: T.illustration.ink })[k] || m); }
const dataUri = (svg) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

function renderMatrix() {
  const head = '<thead><tr><th></th>' + STYLES.map((s) => '<th>' + s[0].toUpperCase() + s.slice(1) + '</th>').join('') + '</tr></thead>';
  const rows = D.icons.map((ic) => '<tr><th scope="row">' + ic.title + '<small>' + ic.category + '</small></th>' + STYLES.map((s) =>
    '<td><button type="button" class="cell" title="Copy ' + ic.name + ' / ' + s + ' SVG" data-copy="icon" data-n="' + ic.name + '" data-s="' + s + '">' + ic.sized[s][st.size] + '</button></td>').join('') + '</tr>').join('');
  $('matrix').innerHTML = head + '<tbody>' + rows + '</tbody>';
  const m = T.icon.opticalStroke[String(st.size)];
  $('sizeNote').textContent = st.size + 'px · stroke × ' + m + ' (regular renders at ' + (1 * m) + ')';
}
function renderAnim() {
  $('anim').innerHTML = D.icons.filter((i) => i.animated).map((ic) => {
    const col = st.icol || getComputedStyle(document.body).color;
    const svg = (st.motion === 'on' ? ic.animated : ic.markup.regular.replace('width="24"', 'width="48"').replace('height="24"', 'height="48"')).replace(/currentColor/g, col);
    const approx = ic.motionSource === 'approximated';
    return '<div class="tile"><div class="art"><img alt="' + ic.title + ' animation" src="' + dataUri(svg) + '"></div><div class="tag">' + ic.name + ' <span class="pill' + (approx ? ' warn' : '') + '">' + (approx ? 'approx' : 'figma') + '</span></div></div>';
  }).join('');
}
function renderIlls() {
  $('ills').innerHTML = D.illustrations.map((il) => {
    const src = (st.motion === 'on' && il.animated && il.animated[st.type]) || il.templates[st.type];
    return '<figure class="card" style="margin:0"><div class="art"><img alt="' + il.title + ', ' + st.type + '" src="' + dataUri(fill(src)) + '"></div>' +
      '<figcaption class="meta"><span><b>' + il.title + '</b> <span class="pill warn">approx motion</span></span><button class="copy" type="button" data-copy="ill" data-n="' + il.name + '">Copy SVG</button></figcaption></figure>';
  }).join('');
}
function render() {
  for (const [id, key] of [['sizes','size'],['itype','type'],['motion','motion']]) $(id).querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v == st[key])));
  renderMatrix(); renderAnim(); renderIlls();
}
$('stats').innerHTML = [
  ['icons', D.icons.length], ['icon styles', D.icons.length * 5], ['illustrations', D.illustrations.length],
  ['illustration types', D.illustrations.length * 3], ['animated icons', D.icons.filter((i) => i.animated).length],
].map(([k, v]) => '<span><b>' + v + '</b> ' + k + '</span>').join('');

const toast = (msg) => { const t = $('toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 1600); };
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-copy]'); if (!b) return;
  let text, label;
  if (b.dataset.copy === 'icon') { const ic = D.icons.find((i) => i.name === b.dataset.n); text = ic.sized[b.dataset.s][st.size]; label = ic.name + ' (' + b.dataset.s + ', ' + st.size + 'px)'; }
  else { const il = D.illustrations.find((i) => i.name === b.dataset.n); text = fill(il.templates[st.type]); label = il.title + ' (' + st.type + ')'; }
  const done = () => toast('Copied ' + label);
  try { navigator.clipboard.writeText(text).then(done, () => fallback(text, done)); } catch (_) { fallback(text, done); }
});
function fallback(text, done) {
  const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); done(); } catch (_) { toast('Copy blocked - markup selected instead'); }
  ta.remove();
}
render();
</script>
`;
