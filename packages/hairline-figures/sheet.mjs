// Contact sheet of blind thumbnails for review.
// Usage: node sheet.mjs <out.png> name1 name2 ...   (uses the right half = answer shot of hairline-<name>-blind.png)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const CACHE = path.join(process.env.LOCALAPPDATA, 'hairline-look');
const { chromium } = createRequire(path.join(CACHE, 'package.json'))('playwright-core');
const [out, ...names] = process.argv.slice(2);
const have = names.filter((n) => fs.existsSync(path.join(here, `hairline-${n}-blind.png`)));
const cell = (n) => {
  const b64 = fs.readFileSync(path.join(here, `hairline-${n}-blind.png`)).toString('base64');
  return `<figure><img src="data:image/png;base64,${b64}"><figcaption>${n}</figcaption></figure>`;
};
const html = `<style>body{margin:0;font:12px system-ui;display:grid;grid-template-columns:repeat(4,1fr);gap:4px;width:1600px;background:#fff}
figure{margin:0}img{width:100%;display:block}figcaption{text-align:center;padding:2px}</style>${have.map(cell).join('')}`;
const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());
const page = await browser.newPage({ viewport: { width: 1600, height: 400 } });
await page.setContent(html);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(`${have.length} on sheet; missing: ${names.filter((n) => !have.includes(n)).join(' ') || 'none'}`);
