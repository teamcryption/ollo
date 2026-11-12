import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'travel',
  icons: [
    icon('bed-leaf', 'Eco Hotel', ['eco', 'green', 'sustainable', 'hotel', 'bed'], [line('M3 17V6M3 13h13v4'), body('M8 8.5h6a2 2 0 0 1 2 2V13H8Z'), body(C(5.5, 10.8, 1.4)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('umbrella-leaf', 'Eco Umbrella', ['eco', 'green', 'sustainable', 'umbrella', 'umbrella'], [line('M3 10a6.5 6.5 0 0 1 13 0ZM9.5 10v5.5a1.5 1.5 0 0 0 3 0'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('palm-tree-leaf', 'Eco Palm Tree', ['eco', 'green', 'sustainable', 'palm tree', 'palm-tree'], [line('M9.5 8.5c.9 3 .9 6.3-.4 9.7'), line('M9.5 8.5C8.5 6 6.5 5 3.5 5.5M9.5 8.5c1-2.5 3-3.5 6-3M9.5 8.5C7.5 8 5.5 9 4.5 11M9.5 8.5c2-.5 4 .5 5 2.5'), line('M4.5 18.5h10'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('campfire-leaf', 'Eco Campfire', ['eco', 'green', 'sustainable', 'campfire', 'campfire'], [body('M9.5 3.5c2 2 3.5 3.7 3.5 6a3.5 3.5 0 0 1-7 0c0-1.3.7-2.4 1.6-3.3.2 1 .7 1.7 1.4 1.9-.3-1.7.1-3.2.5-4.6Z'), line('M4 18l11-3.4M4 14.6 15 18'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('hot-air-balloon-leaf', 'Eco Hot Air Balloon', ['eco', 'green', 'sustainable', 'hot air balloon', 'hot-air-balloon'], [body('M9.5 3a5.5 5.5 0 0 1 5.5 5.5c0 2.6-2.3 4.5-3.5 6h-4C6.3 13 4 11.1 4 8.5A5.5 5.5 0 0 1 9.5 3Z'), line('M9.5 3.4c-1.6 2.2-1.6 8.8 0 11'), line('M7.6 14.7l.3 1.2M11.4 14.7l-.3 1.2'), body(R(7.5, 16.2, 4, 2.3, 0.6)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('hammock-leaf', 'Eco Hammock', ['eco', 'green', 'sustainable', 'hammock', 'hammock'], [line('M3 5v13M16 5v13'), body('M3.3 8c2 4 4 5.5 6.2 5.5s4.2-1.5 6.2-5.5c-2 1.5-4 2.2-6.2 2.2S5.3 9.5 3.3 8Z'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('umbrella-beach-leaf', 'Eco Beach Umbrella', ['eco', 'green', 'sustainable', 'beach umbrella', 'umbrella-beach'], [body('M3 9.5a6.5 6.5 0 0 1 13 0Z'), line('M9.5 9.7V17'), line('M4 18h11'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
  ],
};
