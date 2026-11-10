import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'travel',
  icons: [
    icon('binoculars-chat', 'Binoculars Chat', ['chat', 'support', 'message', 'binoculars', 'binoculars'], [body(R(3.5, 8, 5, 9.5, 2)), body(R(10.5, 8, 5, 9.5, 2)), line('M8.7 10.5h1.6'), line('M4.5 8V5h3v3M11.5 8V5h3v3'), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('sailboat-download', 'Download Sailboat', ['download', 'save', 'export', 'sailboat', 'sailboat'], [body(poly([[9, 3.5], [9, 12], [3.5, 12]], 0.8, true)), body(poly([[10.6, 5.5], [14.8, 12], [10.6, 12]], 0.6, true)), body('M3 14h13l-1.8 3.5H4.8Z'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('binoculars-download', 'Download Binoculars', ['download', 'save', 'export', 'binoculars', 'binoculars'], [body(R(3.5, 8, 5, 9.5, 2)), body(R(10.5, 8, 5, 9.5, 2)), line('M8.7 10.5h1.6'), line('M4.5 8V5h3v3M11.5 8V5h3v3'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('anchor-pencil', 'Edit Anchor', ['edit', 'write', 'modify', 'anchor', 'anchor'], [line(C(9.5, 4.8, 1.4)), line('M9.5 6.2V18M6.5 9h6'), line('M4 13.5c0 2.8 2.5 4.5 5.5 4.5s5.5-1.7 5.5-4.5'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('backpack-pencil', 'Edit Backpack', ['edit', 'write', 'modify', 'backpack', 'backpack'], [line('M7.5 5.5V5a2 2 0 0 1 4 0v.5'), body('M4.5 9a3.5 3.5 0 0 1 3.5-3.5h3A3.5 3.5 0 0 1 14.5 9v8a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 17Z'), line('M7.5 12h4v3'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('lifebuoy-pencil', 'Edit Lifebuoy', ['edit', 'write', 'modify', 'lifebuoy', 'lifebuoy'], [body(C(9.5, 10.5, 6.5)), line(C(9.5, 10.5, 2.8)), line('M5 6l2.4 2.4M14 6l-2.4 2.4M5 15l2.4-2.4'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('sailboat-pencil', 'Edit Sailboat', ['edit', 'write', 'modify', 'sailboat', 'sailboat'], [body(poly([[9, 3.5], [9, 12], [3.5, 12]], 0.8, true)), body(poly([[10.6, 5.5], [14.8, 12], [10.6, 12]], 0.6, true)), body('M3 14h13l-1.8 3.5H4.8Z'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
