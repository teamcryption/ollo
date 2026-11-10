import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'tools',
  icons: [
    icon('wrench-clock', 'Maintenance Schedule', ['service interval', 'repairs due', 'upkeep', 'wrench', 'wrench'], [body('M13.5 3.5a3.5 3.5 0 0 0-3.3 4.6L4 14.3a1.4 1.4 0 0 0 2 2l6.2-6.2A3.5 3.5 0 0 0 16 7l-2 .5-1.5-1.5.5-2Z'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('wrench-pin', 'Repair Shop', ['mechanic nearby', 'service centre', 'garage', 'wrench', 'wrench'], [body('M13.5 3.5a3.5 3.5 0 0 0-3.3 4.6L4 14.3a1.4 1.4 0 0 0 2 2l6.2-6.2A3.5 3.5 0 0 0 16 7l-2 .5-1.5-1.5.5-2Z'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('wrench-star', 'Top Rated Service', ['best repairs', 'trusted mechanic', 'review', 'wrench', 'wrench'], [body('M13.5 3.5a3.5 3.5 0 0 0-3.3 4.6L4 14.3a1.4 1.4 0 0 0 2 2l6.2-6.2A3.5 3.5 0 0 0 16 7l-2 .5-1.5-1.5.5-2Z'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('wrench-search', 'Find a Mechanic', ['repair search', 'technician', 'service', 'wrench', 'wrench'], [body('M13.5 3.5a3.5 3.5 0 0 0-3.3 4.6L4 14.3a1.4 1.4 0 0 0 2 2l6.2-6.2A3.5 3.5 0 0 0 16 7l-2 .5-1.5-1.5.5-2Z'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('wrench-shield', 'Warranty', ['repair guarantee', 'covered', 'protection', 'wrench', 'wrench'], [body('M13.5 3.5a3.5 3.5 0 0 0-3.3 4.6L4 14.3a1.4 1.4 0 0 0 2 2l6.2-6.2A3.5 3.5 0 0 0 16 7l-2 .5-1.5-1.5.5-2Z'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
  ],
};
