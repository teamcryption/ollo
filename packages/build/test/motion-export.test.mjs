import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { frameSvg, pathToShapes, toDotLottie, toLottie } from '../src/motion-export.mjs';

const icons = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../assets/icons');

test('arc converts to cubic beziers with the right control points', () => {
  const [s] = pathToShapes('M3 3H9A3 3 0 0 1 12 6Z');
  assert.equal(s.closed, true);
  assert.deepEqual(s.v, [[3, 3], [9, 3], [12, 6]]);
  assert.ok(Math.abs(s.o[1][0] - 1.6569) < 1e-3);
});

test('every animated icon exports to Lottie and to a static frame', () => {
  let n = 0;
  for (const name of fs.readdirSync(icons)) {
    const meta = JSON.parse(fs.readFileSync(path.join(icons, name, 'meta.json'), 'utf8'));
    if (!meta.animation) continue;
    const svg = fs.readFileSync(path.join(icons, name, 'regular.svg'), 'utf8');
    const l = toLottie(svg, meta.animation, { size: 48 });
    assert.equal(l.w, 48);
    assert.ok(l.layers.some((x) => x.ty === 4), `${name} has shape layers`);
    assert.match(frameSvg(svg, meta.animation, 700), /^<svg/);
    n++;
  }
  assert.ok(n > 10);
});

test('dotLottie is a zip with a manifest', () => {
  const svg = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M4 4L20 20" stroke="#171729"/></svg>';
  const spec = { duration: 1000, tracks: [{ target: 0, property: 'draw', times: [0, 1], values: [0, 1] }] };
  const bytes = toDotLottie(toLottie(svg, spec), { id: 'line' });
  assert.equal(bytes[0], 0x50);
  assert.equal(bytes[1], 0x4b);
  assert.ok(Buffer.from(bytes).includes('manifest.json'));
});
