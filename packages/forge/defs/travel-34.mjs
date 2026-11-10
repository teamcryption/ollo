import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'travel',
  icons: [
    icon('binoculars-pencil', 'Edit Binoculars', ['edit', 'write', 'modify', 'binoculars', 'binoculars'], [body(R(3.5, 8, 5, 9.5, 2)), body(R(10.5, 8, 5, 9.5, 2)), line('M8.7 10.5h1.6'), line('M4.5 8V5h3v3M11.5 8V5h3v3'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('palm-tree-pencil', 'Edit Palm Tree', ['edit', 'write', 'modify', 'palm tree', 'palm-tree'], [line('M9.5 8.5c.9 3 .9 6.3-.4 9.7'), line('M9.5 8.5C8.5 6 6.5 5 3.5 5.5M9.5 8.5c1-2.5 3-3.5 6-3M9.5 8.5C7.5 8 5.5 9 4.5 11M9.5 8.5c2-.5 4 .5 5 2.5'), line('M4.5 18.5h10'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('campfire-pencil', 'Edit Campfire', ['edit', 'write', 'modify', 'campfire', 'campfire'], [body('M9.5 3.5c2 2 3.5 3.7 3.5 6a3.5 3.5 0 0 1-7 0c0-1.3.7-2.4 1.6-3.3.2 1 .7 1.7 1.4 1.9-.3-1.7.1-3.2.5-4.6Z'), line('M4 18l11-3.4M4 14.6 15 18'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('hot-air-balloon-pencil', 'Edit Hot Air Balloon', ['edit', 'write', 'modify', 'hot air balloon', 'hot-air-balloon'], [body('M9.5 3a5.5 5.5 0 0 1 5.5 5.5c0 2.6-2.3 4.5-3.5 6h-4C6.3 13 4 11.1 4 8.5A5.5 5.5 0 0 1 9.5 3Z'), line('M9.5 3.4c-1.6 2.2-1.6 8.8 0 11'), line('M7.6 14.7l.3 1.2M11.4 14.7l-.3 1.2'), body(R(7.5, 16.2, 4, 2.3, 0.6)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
