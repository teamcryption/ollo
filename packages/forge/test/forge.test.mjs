import test from 'node:test';
import assert from 'node:assert/strict';
import { L, R, C, translateD } from '../src/geo.mjs';
import { body, line, accent, withBadge } from '../src/dsl.mjs';
import { renderIcon, STYLES } from '../src/render.mjs';
import { checkGeometry, checkInk, fingerprint, shapeDistance } from '../src/qa.mjs';
import { expand } from '../src/generate.mjs';

const page = [body(R(5, 4, 14, 16, 2.5)), line(L(8.5, 10, 15.5, 10)), accent(L(8.5, 14, 12.5, 14))];

test('one drawing renders all five styles with one colour', () => {
  const { svgs } = renderIcon(page);
  assert.deepEqual(Object.keys(svgs), STYLES);
  for (const s of STYLES) assert.deepEqual([...new Set(svgs[s].match(/#[0-9a-f]{6}/gi))], ['#171729'], s);
  assert.match(svgs.duotone, /fill-opacity="0.25"/);
  assert.doesNotMatch(svgs.fill, /stroke=/);
});

test('fill knocks inner details out instead of drawing them', () => {
  const { svgs } = renderIcon(page);
  assert.equal(checkInk(svgs).length, 0);
  assert.equal((svgs.fill.match(/<path/g) || []).length, 1);
});

test('QA catches an accent that touches the outline', () => {
  const bad = [body(R(5, 4, 14, 16, 2.5)), accent(L(5.5, 12, 10, 12))];
  assert.ok(checkGeometry({ els: bad }).errors.some((e) => e.startsWith('accent')));
  assert.equal(checkGeometry({ els: page }).errors.length, 0);
});

test('QA flags drawings that leave the canvas', () => {
  assert.ok(checkGeometry({ els: [body(R(0, 0, 24, 24, 2))] }).errors.some((e) => e.startsWith('grid')));
});

test('duplicate check separates a nudged copy from a different glyph', () => {
  const fp = (els) => fingerprint(renderIcon(els).svgs.regular);
  const plus = [body(C(12, 12, 8.5)), line(L(8.5, 12, 15.5, 12)), line(L(12, 8.5, 12, 15.5))];
  const minus = [body(C(12, 12, 8.5)), line(L(8.5, 12, 15.5, 12))];
  const nudged = plus.map((e) => ({ ...e, d: translateD(e.d, 0.4, 0) }));
  assert.ok(shapeDistance(fp(plus), fp(minus)) >= 2);
  assert.ok(shapeDistance(fp(plus), fp(nudged)) <= 1.5);
});

test('expand derives directions, mirrors and badges with their own names', () => {
  const def = { name: 'arrow-right', title: 'Arrow Right', tags: ['arrow', 'right', 'next'], dir: 'right', turns: { left: 180 }, els: [line(L(5, 12, 19, 12))], badges: ['add'] };
  const out = expand(def, 'arrows');
  assert.deepEqual(out.map((i) => i.name), ['arrow-right', 'arrow-left', 'arrow-right-add']);
  assert.ok(out[1].tags.includes('left') && !out[1].tags.includes('right'));
  assert.equal(withBadge(def.els, 'check').filter((e) => e.badge).length, 2);
});

test('off and container variants', async () => {
  const { expand } = await import('../src/generate.mjs');
  const { icon, body, accent } = await import('../src/dsl.mjs');
  const { R, L } = await import('../src/geo.mjs');
  const out = expand(icon('box', 'Box', ['a', 'b', 'c'], [body(R(5, 5, 14, 14, 2)), accent(L(9, 12, 15, 12))], { off: true, containers: ['circle'] }), 'interface');
  assert.deepEqual(out.map((i) => i.name), ['box', 'box-off', 'box-circle']);
  assert.equal(out[1].els.at(-1).cover, true);
  assert.equal(out[2].els[0].role, 'body');
  const ext = expand(icon('user', 'User', ['a', 'b', 'c'], [body(R(5, 5, 14, 14, 2))], { extend: true, badges: ['add'] }), 'people');
  assert.deepEqual(ext.map((i) => i.name), ['user-add']);
});
