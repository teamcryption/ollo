import test from 'node:test';
import assert from 'node:assert/strict';
import { loadAll } from '../src/load.mjs';
import { processIcon, processIllustration, iconAtSize } from '../src/svg.mjs';
import { animateSvg, compileCss } from '../src/motion.mjs';

const { tokens, icons, illustrations, errors } = loadAll();

test('assets validate', () => assert.deepEqual(errors, []));

test('icons tokenise to currentColor with no stray colours', () => {
  for (const icon of icons) for (const [style, raw] of Object.entries(icon.svgs)) {
    const { svg, warnings } = processIcon(raw, tokens, style);
    assert.deepEqual(warnings, [], `${icon.name}/${style}`);
    assert.match(svg, /currentColor/);
    assert.doesNotMatch(svg, /\sid=/);
  }
});

test('optical stroke at 16px', () => {
  const { svg } = processIcon(icons[0].svgs.regular, tokens, 'regular');
  assert.match(iconAtSize(svg, 16, tokens), /stroke-width="1.25"[^>]*width="16"/);
});

test('illustrations become full templates', () => {
  for (const ill of illustrations) for (const [type, raw] of Object.entries(ill.svgs)) {
    const { template, warnings } = processIllustration(raw, tokens);
    assert.deepEqual(warnings, [], `${ill.name}/${type}`);
    assert.match(template, /\{\{background\}\}/);
  }
});

test('motion compiles and tags targets', () => {
  const lock = icons.find((i) => i.name === 'lock');
  const { svg } = processIcon(lock.svgs.regular, tokens, 'regular');
  const out = animateSvg(svg, lock.animation);
  assert.match(out, /class="m-root"/);
  assert.match(out, /<path class="m-p1"/);
  assert.match(compileCss(lock.animation), /translate:-1.2px 0px/);
});
