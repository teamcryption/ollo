// Screenshot the built review page (Latest batch, Last 5 batches, All) to check it before publishing.
// Usage: node tools/shot.cjs <review-dir> <out-prefix>
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
(async () => {
  const [root, prefix] = process.argv.slice(2);
  const srv = http.createServer((q, r) => {
    const u = decodeURIComponent(q.url.split('?')[0]);
    const f = path.join(root, u === '/' ? 'index.html' : u);
    fs.readFile(f, (e, d) => {
      if (e) { r.writeHead(404); r.end(); return; }
      r.writeHead(200, { 'content-type': f.endsWith('.json') ? 'application/json' : 'text/html' });
      r.end(d);
    });
  }).listen(8765);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(1500);
  await p.screenshot({ path: prefix + '-latest.png' });
  await p.click('[data-coll="recent"]'); await p.waitForTimeout(1500);
  await p.screenshot({ path: prefix + '-recent.png' });
  await p.click('[data-coll="all"]'); await p.waitForTimeout(1500);
  await p.screenshot({ path: prefix + '-all.png' });
  await b.close(); srv.close();
})();
