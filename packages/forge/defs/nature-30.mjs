import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'nature',
  icons: [
    icon('leaf-search', 'Search Leaf', ['search', 'find', 'lookup', 'leaf', 'leaf'], [body('M4 16c0-6.5 4-11 11-12 .5 7-3.5 12-10 12Z'), line('M4.5 15.5 11 9'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('leaf-clock', 'Leaf Schedule', ['schedule', 'time', 'history', 'leaf', 'leaf'], [body('M4 16c0-6.5 4-11 11-12 .5 7-3.5 12-10 12Z'), line('M4.5 15.5 11 9'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('mountain-shield', 'Mountain Protection', ['protected', 'secure', 'safety', 'mountain', 'mountain'], [body(poly([[2.5, 16.5], [7.5, 7], [10, 11], [12, 8], [16.5, 16.5]], 0.8, true)), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('plant-gear', 'Plant Settings', ['settings', 'configure', 'preferences', 'plant', 'plant'], [line('M9.5 11V8M9.5 8c-2 0-3.5-1.3-3.5-3.5 2 0 3.5 1.3 3.5 3.5Zm0 0c2 0 3.5-1.3 3.5-3.5-2 0-3.5 1.3-3.5 3.5Z'), body('M5 11h9l-1 6a1 1 0 0 1-1 .8H7a1 1 0 0 1-1-.8Z'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('mountain-gear', 'Mountain Settings', ['settings', 'configure', 'preferences', 'mountain', 'mountain'], [body(poly([[2.5, 16.5], [7.5, 7], [10, 11], [12, 8], [16.5, 16.5]], 0.8, true)), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('leaf-gear', 'Leaf Settings', ['settings', 'configure', 'preferences', 'leaf', 'leaf'], [body('M4 16c0-6.5 4-11 11-12 .5 7-3.5 12-10 12Z'), line('M4.5 15.5 11 9'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('plant-bolt', 'Instant Plant', ['quick', 'fast', 'instant', 'plant', 'plant'], [line('M9.5 11V8M9.5 8c-2 0-3.5-1.3-3.5-3.5 2 0 3.5 1.3 3.5 3.5Zm0 0c2 0 3.5-1.3 3.5-3.5-2 0-3.5 1.3-3.5 3.5Z'), body('M5 11h9l-1 6a1 1 0 0 1-1 .8H7a1 1 0 0 1-1-.8Z'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('mountain-bolt', 'Instant Mountain', ['quick', 'fast', 'instant', 'mountain', 'mountain'], [body(poly([[2.5, 16.5], [7.5, 7], [10, 11], [12, 8], [16.5, 16.5]], 0.8, true)), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('leaf-bolt', 'Instant Leaf', ['quick', 'fast', 'instant', 'leaf', 'leaf'], [body('M4 16c0-6.5 4-11 11-12 .5 7-3.5 12-10 12Z'), line('M4.5 15.5 11 9'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
