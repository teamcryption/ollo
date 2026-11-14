// Exports every figure in figures.json for the website:
//   dist/<name>.svg     the rest pose as an illustration template ({{background}} faces, {{ink}} lines,
//                       the four Hairline strokes kept as ink at four strengths)
//   dist/hairline.json  { kernel, figures: { <name>: { code, tour, range, means } } } for the live views
// Usage: node export.mjs   (needs a browser: Chrome, or Playwright's Chromium from the hairline-look cache)
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
const SKILL = path.join(os.homedir(), '.claude/skills/hairline-create');
const CACHE = process.env.HAIRLINE_LOOK_CACHE ?? path.join(process.env.LOCALAPPDATA ?? path.join(os.homedir(), '.cache'), 'hairline-look');
const { chromium } = createRequire(path.join(CACHE, 'package.json'))('playwright-core');
const figs = JSON.parse(fs.readFileSync(path.join(here, 'figures.json'), 'utf8'));
const kernel = fs.readFileSync(path.join(here, 'kernel.js'), 'utf8');
const DIST = path.join(here, 'dist');
fs.mkdirSync(DIST, { recursive: true });

// The light palette (kernel styles.ts): plate, then the four strokes, strongest first.
const PLATE = 'rgb(255, 255, 255)';
const INKS = { 'rgb(35, 35, 39)': 1, 'rgb(164, 164, 172)': 0.5, 'rgb(195, 195, 201)': 0.32, 'rgb(224, 224, 228)': 0.16 };

const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());
const page = await browser.newPage({ viewport: { width: 900, height: 900 } });
const bundle = { kernel, figures: {} };
for (const f of figs) {
  const name = f.file.replace(/\.js$/, '');
  const svgOut = path.join(DIST, `${name}.svg`);
  // incremental: an SVG newer than its figure source is already current (pass --all to redo every one)
  if (!process.argv.includes('--all') && fs.existsSync(svgOut) && fs.statSync(svgOut).mtimeMs > fs.statSync(path.join(here, f.file)).mtimeMs) {
    bundle.figures[name] = { code: fs.readFileSync(path.join(here, f.file), 'utf8') };
    continue;
  }
  execFileSync(process.execPath, [path.join(SKILL, 'build.mjs'), f.file], { cwd: here, stdio: 'ignore' });
  await page.goto(pathToFileURL(path.join(here, `hairline-${name}.html`)).href + '?theme=light');
  await page.waitForTimeout(2200);
  const svg = await page.evaluate(({ PLATE, INKS }) => {
    const src = document.querySelector('#stage svg');
    const out = src.cloneNode(true), a = src.querySelectorAll('*'), b = out.querySelectorAll('*');
    a.forEach((el, i) => {
      const d = b[i];
      d.removeAttribute('class');
      if (!['path', 'circle', 'ellipse', 'polygon', 'line'].includes(el.tagName)) return;
      if (el.closest('mask')) return;
      const cs = getComputedStyle(el);
      if (cs.fill === 'none') d.setAttribute('fill', 'none');
      else if (cs.fill === PLATE) d.setAttribute('fill', '{{background}}');
      else if (INKS[cs.fill] != null) { d.setAttribute('fill', '{{ink}}'); if (INKS[cs.fill] < 1) d.setAttribute('fill-opacity', String(INKS[cs.fill])); }
      if (cs.stroke === 'none') d.setAttribute('stroke', 'none');
      else if (INKS[cs.stroke] != null) {
        d.setAttribute('stroke', '{{ink}}');
        if (INKS[cs.stroke] < 1) d.setAttribute('stroke-opacity', String(INKS[cs.stroke]));
        d.setAttribute('stroke-width', '1');
        d.setAttribute('stroke-linejoin', 'round');
        d.setAttribute('stroke-linecap', 'round');
        d.setAttribute('vector-effect', 'non-scaling-stroke');
      }
    });
    out.removeAttribute('aria-hidden');
    out.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    out.setAttribute('width', '400');
    out.setAttribute('height', '320');
    out.insertAdjacentHTML('afterbegin', '<rect width="400" height="320" fill="{{background}}"/>');
    return out.outerHTML;
  }, { PLATE, INKS });
  // the card rect first and self-closing: the site's background option finds it by that shape
  const clean = svg.replace(/\s+/g, ' ').replace(/> </g, '><').replace(/<rect([^>]*)><\/rect>/g, '<rect$1/>');
  fs.writeFileSync(path.join(DIST, `${name}.svg`), clean);
  bundle.figures[name] = { code: fs.readFileSync(path.join(here, f.file), 'utf8') };
  console.log(`exported ${name}: ${(svg.length / 1024).toFixed(0)} KB`);
}
await browser.close();
fs.writeFileSync(path.join(DIST, 'hairline.json'), JSON.stringify(bundle));
console.log(`dist/hairline.json: ${figs.length} figures`);
