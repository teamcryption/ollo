import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'buildings',
  icons: [
    icon('factory-gear', 'Production Settings', ['manufacturing', 'plant settings', 'operations', 'industry', 'factory'], [body(poly([[3, 16.5], [3, 9], [7, 11], [7, 9], [11, 11], [11, 4.5], [15.5, 4.5], [15.5, 16.5]], 0.8, true)), line('M6 14h2M10 14h2'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('factory-clock', 'Shift Time', ['production schedule', 'factory hours', 'shifts', 'industry', 'factory'], [body(poly([[3, 16.5], [3, 9], [7, 11], [7, 9], [11, 11], [11, 4.5], [15.5, 4.5], [15.5, 16.5]], 0.8, true)), line('M6 14h2M10 14h2'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('factory-shield', 'Workplace Safety', ['factory safety', 'compliance', 'protection', 'industry', 'factory'], [body(poly([[3, 16.5], [3, 9], [7, 11], [7, 9], [11, 11], [11, 4.5], [15.5, 4.5], [15.5, 16.5]], 0.8, true)), line('M6 14h2M10 14h2'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('factory-pin', 'Plant Location', ['factory site', 'manufacturing location', 'map', 'industry', 'factory'], [body(poly([[3, 16.5], [3, 9], [7, 11], [7, 9], [11, 11], [11, 4.5], [15.5, 4.5], [15.5, 16.5]], 0.8, true)), line('M6 14h2M10 14h2'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('factory-search', 'Find Supplier', ['manufacturer search', 'sourcing', 'suppliers', 'industry', 'factory'], [body(poly([[3, 16.5], [3, 9], [7, 11], [7, 9], [11, 11], [11, 4.5], [15.5, 4.5], [15.5, 16.5]], 0.8, true)), line('M6 14h2M10 14h2'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
  ],
};
