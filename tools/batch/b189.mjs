import { B } from './mods.mjs';
Object.assign(B, {
  'garden-hose': `line(C(8.5, 11, 5) + C(8.5, 11, 2.2)), line('M13.5 11h2v-4'), body(R(14.5, 3.5, 2.5, 3.5, 0.6))`,
  'flower-pot': `line('M9.5 10V5.5M9.5 7.5c1.5-2 3-2.5 4.5-2M9.5 6.5C8 4.5 6.5 4 5 4.3'), body('M4.5 10.5h10l-1.5 7.5H6Z'), line('M4.7 12.5h9.6')`,
  'greenhouse': `body(poly([[3, 9.5], [9.5, 4], [16, 9.5], [16, 18], [3, 18]], 0.8, true)), line('M9.5 4.3V18M3.2 13h12.6'), line('M6.3 9.5V18M12.7 9.5V18')`,
  'lawn-mower': `line('M3.5 4 7 11'), body('M6.5 10h7.5a2 2 0 0 1 2 2v2.5H6.5Z'), line(C(8, 16.5, 1.4) + C(14, 16.5, 1.4))`,
  'birdbath': `body('M3 6h13a6.5 3 0 0 1-13 0Z'), line('M9.5 9v7M6.5 17.5h6')`,
  'wind-sock': `line('M4 18V3'), body(poly([[4.4, 4], [15, 5.5], [15, 9.5], [4.4, 11]], 0.6, true)), line('M8 4.6v5.8M11.5 5v5')`,
  'fog': `line('M3 7h13M5 10.5h11M3 14h9M7 17.5h9')`,
  'earthquake': `line('M2.5 10.5h3l1.5-4 2 8 2-10 2 9 1.5-3h2.5')`,
  'flood': `body(poly([[4, 9.5], [9.5, 4.5], [15, 9.5], [15, 13], [4, 13]], 0.6, true)), line('M3 15.5c1.3-1 2.7-1 4 0s2.7 1 4 0 2.7-1 4 0M3 18c1.3-1 2.7-1 4 0s2.7 1 4 0 2.7-1 4 0')`,
  'wildfire': `body('M9.5 3c2.5 2.5 4 4.5 4 7a4 4 0 0 1-8 0c0-1.5.6-2.6 1.5-3.6.2 1 .7 1.6 1.3 1.8-.3-1.9.2-3.6 1.2-5.2Z'), line('M3 17.5l2.5-3 2 2 2-3 2 2 2-3 2.5 5')`,
  'scalpel': `line('M3.5 17.5 11 10'), body('M10.5 10.5 15.5 4c1.5 1.5 1 4-1.5 6L12 11.5Z')`,
  'pill-blister': `body(R(3.5, 4, 12, 13, 2)), line(C(7, 8, 1.4) + C(12, 8, 1.4) + C(7, 13, 1.4) + C(12, 13, 1.4))`,
  'iv-drip': `line('M5 18V3M5 3.5h6'), body('M9 4h4v6a2 2 0 0 1-4 0Z'), line('M11 12v2.5c0 2-1.5 3-3 3H5')`,
  'blood-drop': `body('M9.5 3c2.5 3.2 5 6 5 9a5 5 0 0 1-10 0c0-3 2.5-5.8 5-9Z'), line('M9.5 10v4.5M7.25 12.25h4.5')`,
  'lungs': `line('M9.5 3v7'), body('M8.5 7.5c-3 0-5 3.5-5 7 0 2 1 3 2.5 3s2.5-1 2.5-3Z'), body('M10.5 7.5c3 0 5 3.5 5 7 0 2-1 3-2.5 3s-2.5-1-2.5-3Z')`,
  'git-merge': `line(C(5.5, 4.5, 1.6) + C(5.5, 16.5, 1.6) + C(13.5, 10.5, 1.6)), line('M5.5 6.2v8.6M5.5 6.5c0 3 3 4 6.4 4')`,
  'pull-request': `line(C(5, 4.5, 1.6) + C(5, 16.5, 1.6) + C(14, 16.5, 1.6)), line('M5 6.2v8.6M14 14.8V8a2.5 2.5 0 0 0-2.5-2.5H8.5M10 3.8 8.3 5.5 10 7.2')`,
  'api': `body(R(3, 5, 13, 11, 2)), line('M6.5 12.5l1.3-4 1.3 4M7 11.3h1.6M10.5 12.5v-4h1a1.2 1.2 0 0 1 0 2.4h-1M14 8.5v4')`,
  'kanban': `body(R(3, 3.5, 13, 14, 1.5)), line('M7.5 3.7v13.6M11.5 3.7v13.6'), line('M4.8 6.5h1M4.8 9h1M9 6.5h1.2M13 6.5h1M13 9h1M13 11.5h1')`,
  'sitemap': `body(R(7, 3, 5, 3.5, 0.8)), body(R(2.5, 13.5, 4.5, 3.5, 0.8)), body(R(12, 13.5, 4.5, 3.5, 0.8)), line('M9.5 6.7V10M4.75 13.3V10h9.5v3.3')`,
  'flowchart': `body(R(6, 3, 7, 3.5, 0.8)), body(poly([[9.5, 9], [12, 11], [9.5, 13], [7, 11]], 0.4, true)), body(R(6, 15, 7, 3, 0.8)), line('M9.5 6.7V9M9.5 13.2V15')`,
  'variable': `line('M6 4c-2 2-2 11 0 13M13 4c2 2 2 11 0 13'), line('M7.5 8l4 5M11.5 8l-4 5')`,
  'drumsticks': `line('M4 4l9.5 11M15 4 5.5 15'), body(C(14, 15.8, 1.5)), body(C(5, 15.8, 1.5))`,
  'xylophone': `line('M3 7 16 9M3 15l13-2'), body(R(4, 6, 2, 10, 0.6)), body(R(8.5, 6.8, 2, 8.4, 0.6)), body(R(13, 7.6, 2, 6.8, 0.6))`,
  'music-stand': `body(R(3.5, 3.5, 12, 7, 1)), line('M6 6h7M6 8h5'), line('M9.5 10.7V18M6 18l3.5-2 3.5 2')`,
  'cd': `body(C(9.5, 10.5, 6.5)), line(C(9.5, 10.5, 1.8)), line('M12.8 6.5a4.8 4.8 0 0 1 1.5 2.5')`,
  'clipboard-list': `line('M7 4V3h5v1'), body(R(4, 4, 11, 14.5, 1.5)), line(D(7, 8.5) + D(7, 11.5) + D(7, 14.5)), line('M9 8.5h3.5M9 11.5h3.5M9 14.5h3.5')`,
});
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, { 'garden-hose': 'nature', 'flower-pot': 'nature', 'greenhouse': 'nature', 'lawn-mower': 'tools', 'birdbath': 'nature', 'wind-sock': 'weather', 'fog': 'weather', 'earthquake': 'weather', 'flood': 'weather', 'wildfire': 'weather', 'scalpel': 'health', 'pill-blister': 'health', 'iv-drip': 'health', 'blood-drop': 'health', 'lungs': 'health', 'git-merge': 'development', 'pull-request': 'development', 'api': 'development', 'kanban': 'business', 'sitemap': 'data', 'flowchart': 'data', 'variable': 'development', 'drumsticks': 'media', 'xylophone': 'media', 'music-stand': 'media', 'cd': 'media', 'clipboard-list': 'business' });
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, { 'api': 'API', 'cd': 'CD', 'iv-drip': 'IV Drip', 'wind-sock': 'Windsock', 'pill-blister': 'Pill Pack', 'git-merge': 'Merge', 'pull-request': 'Pull Request', 'clipboard-list': 'Checklist' });
export default {};
