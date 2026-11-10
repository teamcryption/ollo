import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'fashion',
  icons: [
    icon('hanger-search', 'Search Hanger', ['search', 'find', 'lookup', 'hanger', 'hanger'], [line('M9.5 5.5a1.5 1.5 0 1 1 1.5 1.5c-.6 0-1.5.5-1.5 1.5v.5L3.5 13.5h12L9.5 9'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('shirt-clock', 'Shirt Schedule', ['schedule', 'time', 'history', 'shirt', 'shirt'], [body(poly([[6, 3.5], [13, 3.5], [16, 6.5], [14, 9], [13, 8], [13, 16.5], [6, 16.5], [6, 8], [5, 9], [3, 6.5]], 0.8, true)), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('shirt-shield', 'Shirt Protection', ['protected', 'secure', 'safety', 'shirt', 'shirt'], [body(poly([[6, 3.5], [13, 3.5], [16, 6.5], [14, 9], [13, 8], [13, 16.5], [6, 16.5], [6, 8], [5, 9], [3, 6.5]], 0.8, true)), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('scissors-shield', 'Scissors Protection', ['protected', 'secure', 'safety', 'scissors', 'scissors'], [line('M7.3 11.5 14 4M11.7 11.5 5 4'), body(C(5.5, 14, 2.2)), body(C(13.5, 14, 2.2)), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('hanger-shield', 'Hanger Protection', ['protected', 'secure', 'safety', 'hanger', 'hanger'], [line('M9.5 5.5a1.5 1.5 0 1 1 1.5 1.5c-.6 0-1.5.5-1.5 1.5v.5L3.5 13.5h12L9.5 9'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('shirt-gear', 'Shirt Settings', ['settings', 'configure', 'preferences', 'shirt', 'shirt'], [body(poly([[6, 3.5], [13, 3.5], [16, 6.5], [14, 9], [13, 8], [13, 16.5], [6, 16.5], [6, 8], [5, 9], [3, 6.5]], 0.8, true)), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('scissors-gear', 'Scissors Settings', ['settings', 'configure', 'preferences', 'scissors', 'scissors'], [line('M7.3 11.5 14 4M11.7 11.5 5 4'), body(C(5.5, 14, 2.2)), body(C(13.5, 14, 2.2)), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('hanger-gear', 'Hanger Settings', ['settings', 'configure', 'preferences', 'hanger', 'hanger'], [line('M9.5 5.5a1.5 1.5 0 1 1 1.5 1.5c-.6 0-1.5.5-1.5 1.5v.5L3.5 13.5h12L9.5 9'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('shirt-bolt', 'Instant Shirt', ['quick', 'fast', 'instant', 'shirt', 'shirt'], [body(poly([[6, 3.5], [13, 3.5], [16, 6.5], [14, 9], [13, 8], [13, 16.5], [6, 16.5], [6, 8], [5, 9], [3, 6.5]], 0.8, true)), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('scissors-bolt', 'Instant Scissors', ['quick', 'fast', 'instant', 'scissors', 'scissors'], [line('M7.3 11.5 14 4M11.7 11.5 5 4'), body(C(5.5, 14, 2.2)), body(C(13.5, 14, 2.2)), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('hanger-bolt', 'Instant Hanger', ['quick', 'fast', 'instant', 'hanger', 'hanger'], [line('M9.5 5.5a1.5 1.5 0 1 1 1.5 1.5c-.6 0-1.5.5-1.5 1.5v.5L3.5 13.5h12L9.5 9'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
