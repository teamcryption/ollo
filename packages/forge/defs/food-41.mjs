import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'food',
  icons: [
    icon('pizza-search', 'Search Pizza', ['search', 'find', 'lookup', 'pizza', 'pizza'], [body(poly([[3, 4.5], [16, 7.5], [6.5, 17]], 1, true)), line('M3.4 7.5 13.5 9.6'), line(D(7, 10.5) + D(9.5, 13) + D(10.5, 10.5)), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('cake-search', 'Search Cake', ['search', 'find', 'lookup', 'cake', 'cake'], [line('M9.5 9.5V6.5'), line(D(9.5, 4.8)), body(R(4, 10, 11, 7, 1.5)), line('M4.2 13c1.2 1 2.4 1 3.6 0s2.4-1 3.6 0 2.4 1 3.6 0'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('coffee-shield', 'Coffee Protection', ['protected', 'secure', 'safety', 'coffee', 'coffee'], [body('M4 7.5h9V12a4.5 4.5 0 0 1-9 0Z'), line('M13 8.5h1a2 2 0 0 1 0 4h-1M7 3.5v2M10 3.5v2'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('pizza-shield', 'Pizza Protection', ['protected', 'secure', 'safety', 'pizza', 'pizza'], [body(poly([[3, 4.5], [16, 7.5], [6.5, 17]], 1, true)), line('M3.4 7.5 13.5 9.6'), line(D(7, 10.5) + D(9.5, 13) + D(10.5, 10.5)), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('cake-shield', 'Cake Protection', ['protected', 'secure', 'safety', 'cake', 'cake'], [line('M9.5 9.5V6.5'), line(D(9.5, 4.8)), body(R(4, 10, 11, 7, 1.5)), line('M4.2 13c1.2 1 2.4 1 3.6 0s2.4-1 3.6 0 2.4 1 3.6 0'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('coffee-gear', 'Coffee Settings', ['settings', 'configure', 'preferences', 'coffee', 'coffee'], [body('M4 7.5h9V12a4.5 4.5 0 0 1-9 0Z'), line('M13 8.5h1a2 2 0 0 1 0 4h-1M7 3.5v2M10 3.5v2'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('pizza-gear', 'Pizza Settings', ['settings', 'configure', 'preferences', 'pizza', 'pizza'], [body(poly([[3, 4.5], [16, 7.5], [6.5, 17]], 1, true)), line('M3.4 7.5 13.5 9.6'), line(D(7, 10.5) + D(9.5, 13) + D(10.5, 10.5)), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('restaurant-gear', 'Restaurant Settings', ['settings', 'configure', 'preferences', 'restaurant', 'restaurant'], [line('M5 3.5v5a2 2 0 0 0 4 0v-5M7 3.5v14M13.5 3.5c-1.5 0-2.5 2-2.5 5h2.5v9'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('cake-gear', 'Cake Settings', ['settings', 'configure', 'preferences', 'cake', 'cake'], [line('M9.5 9.5V6.5'), line(D(9.5, 4.8)), body(R(4, 10, 11, 7, 1.5)), line('M4.2 13c1.2 1 2.4 1 3.6 0s2.4-1 3.6 0 2.4 1 3.6 0'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('pizza-bolt', 'Instant Pizza', ['quick', 'fast', 'instant', 'pizza', 'pizza'], [body(poly([[3, 4.5], [16, 7.5], [6.5, 17]], 1, true)), line('M3.4 7.5 13.5 9.6'), line(D(7, 10.5) + D(9.5, 13) + D(10.5, 10.5)), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('cake-bolt', 'Instant Cake', ['quick', 'fast', 'instant', 'cake', 'cake'], [line('M9.5 9.5V6.5'), line(D(9.5, 4.8)), body(R(4, 10, 11, 7, 1.5)), line('M4.2 13c1.2 1 2.4 1 3.6 0s2.4-1 3.6 0 2.4 1 3.6 0'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
