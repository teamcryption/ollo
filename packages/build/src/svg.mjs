// SVG clean-up and tokenisation.
import { optimize } from 'svgo';

const hexRe = (hex) => new RegExp(hex, 'gi');

// Drop Figma artefacts: per-path ids, the root group id, and the trim-path state
// (pathLength="1" + stroke-dasharray="1 1") left behind by Figma Motion.
const figmaCleanup = {
  name: 'figmaCleanup',
  fn: () => ({
    element: {
      enter(node, parent) {
        const a = node.attributes;
        if (a.pathLength === '1' && a['stroke-dasharray'] === '1 1') {
          delete a.pathLength;
          delete a['stroke-dasharray'];
        }
        if (node.name === 'g' && a.id) {
          // Root group carries the Figma frame name ("Server Stack/Stroke") - unwrap target.
          if (a.id.includes('/')) delete a.id;
          else { a['data-part'] = a.id; delete a.id; }
        } else if (a.id) delete a.id;
      },
    },
  }),
};

function svgo(svg, { keepGroups }) {
  return optimize(svg, {
    multipass: true,
    floatPrecision: 3,
    plugins: [
      figmaCleanup,
      {
        name: 'preset-default',
        params: {
          overrides: {
            mergePaths: false, // keep path order stable: motion targets path indexes
            collapseGroups: keepGroups ? false : undefined,
            moveElemsAttrsToGroup: false,
            moveGroupAttrsToElems: false,
            cleanupIds: false,
          },
        },
      },
    ],
  }).data;
}

/** Icon: clean, colour -> currentColor, stroke-width hoisted to the root <svg>. */
export function processIcon(raw, tokens, style) {
  let svg = svgo(raw, { keepGroups: false });
  svg = svg.replace(hexRe(tokens.icon.primary), 'currentColor');
  const leftover = svg.match(/#[0-9a-f]{3,6}\b/gi);
  const sw = tokens.icon.styles[style]?.strokeWidth;
  svg = svg.replace(/\sstroke-width="[^"]*"/g, '');
  if (sw != null) svg = svg.replace('<svg', `<svg stroke-width="${sw}"`);
  return { svg, warnings: leftover ? [`unexpected colours ${[...new Set(leftover)].join(', ')}`] : [] };
}

/** Body (inner markup) and attributes of the root element. */
export function splitSvg(svg) {
  const m = svg.match(/^<svg([^>]*)>([\s\S]*)<\/svg>\s*$/);
  if (!m) throw new Error('not an <svg> root');
  return { attrs: m[1], body: m[2] };
}

/** Icon at a given render size with optically adjusted stroke. */
export function iconAtSize(svg, size, tokens) {
  const mult = opticalMultiplier(size, tokens);
  return svg
    .replace(/(<svg[^>]*?)\swidth="\d+"/, `$1 width="${size}"`)
    .replace(/(<svg[^>]*?)\sheight="\d+"/, `$1 height="${size}"`)
    .replace(/(<svg[^>]*?)stroke-width="([\d.]+)"/, (_, a, w) => `${a}stroke-width="${round(+w * mult)}"`);
}

export function opticalMultiplier(size, tokens) {
  const t = tokens.icon.opticalStroke?.[String(size)];
  return t ?? Math.min(1.5, Math.max(0.75, Math.pow(24 / size, 0.55)));
}

const round = (n) => Math.round(n * 1000) / 1000;

const ILL_KEYS = ['primary', 'secondary', 'background', 'ink'];

/** Illustration: clean, hex colours -> {{token}} placeholders (template). */
export function processIllustration(raw, tokens) {
  let svg = svgo(raw, { keepGroups: true });
  for (const k of ILL_KEYS) svg = svg.replace(hexRe(tokens.illustration[k]), `{{${k}}}`);
  const leftover = svg.match(/#[0-9a-f]{3,6}\b/gi);
  return { template: svg, warnings: leftover ? [`unexpected colours ${[...new Set(leftover)].join(', ')}`] : [] };
}

export function fillTemplate(template, colours) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => colours[k] ?? _);
}
