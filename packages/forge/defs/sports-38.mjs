import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'sports',
  icons: [
    icon('trophy-search', 'Search Trophy', ['search', 'find', 'lookup', 'trophy', 'trophy'], [body('M5.5 4h8v3.5a4 4 0 0 1-8 0Z'), line('M5.5 5.5H4a1.5 1.5 0 0 0 0 3h1.7M13.5 5.5H15a1.5 1.5 0 0 1 0 3h-1.7M9.5 11.5V15'), body(R(6.5, 15.5, 6, 2.5, 0.8)), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('trophy-shield', 'Trophy Protection', ['protected', 'secure', 'safety', 'trophy', 'trophy'], [body('M5.5 4h8v3.5a4 4 0 0 1-8 0Z'), line('M5.5 5.5H4a1.5 1.5 0 0 0 0 3h1.7M13.5 5.5H15a1.5 1.5 0 0 1 0 3h-1.7M9.5 11.5V15'), body(R(6.5, 15.5, 6, 2.5, 0.8)), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('dumbbell-shield', 'Dumbbell Protection', ['protected', 'secure', 'safety', 'dumbbell', 'dumbbell'], [body(R(3, 7.5, 2.4, 6, 0.8)), body(R(13.6, 7.5, 2.4, 6, 0.8)), line('M5.4 10.5h8.2'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('soccer-shield', 'Soccer Protection', ['protected', 'secure', 'safety', 'soccer', 'soccer'], [body(C(9.5, 10, 6.5)), line(poly([[9.5, 7.6], [11.8, 9.3], [10.9, 12], [8.1, 12], [7.2, 9.3]], 0.3, true)), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('trophy-gear', 'Trophy Settings', ['settings', 'configure', 'preferences', 'trophy', 'trophy'], [body('M5.5 4h8v3.5a4 4 0 0 1-8 0Z'), line('M5.5 5.5H4a1.5 1.5 0 0 0 0 3h1.7M13.5 5.5H15a1.5 1.5 0 0 1 0 3h-1.7M9.5 11.5V15'), body(R(6.5, 15.5, 6, 2.5, 0.8)), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('dumbbell-gear', 'Dumbbell Settings', ['settings', 'configure', 'preferences', 'dumbbell', 'dumbbell'], [body(R(3, 7.5, 2.4, 6, 0.8)), body(R(13.6, 7.5, 2.4, 6, 0.8)), line('M5.4 10.5h8.2'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('soccer-gear', 'Soccer Settings', ['settings', 'configure', 'preferences', 'soccer', 'soccer'], [body(C(9.5, 10, 6.5)), line(poly([[9.5, 7.6], [11.8, 9.3], [10.9, 12], [8.1, 12], [7.2, 9.3]], 0.3, true)), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('pool-gear', 'Pool Settings', ['settings', 'configure', 'preferences', 'pool', 'pool'], [line('M6.5 3.5v8.5M11.5 3.5v8.5M6.5 6h5M6.5 9h5'), line('M3 14.5c1.2-1 2.3-1 3.5 0s2.3 1 3.5 0 2.3-1 3.5 0'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('trophy-bolt', 'Instant Trophy', ['quick', 'fast', 'instant', 'trophy', 'trophy'], [body('M5.5 4h8v3.5a4 4 0 0 1-8 0Z'), line('M5.5 5.5H4a1.5 1.5 0 0 0 0 3h1.7M13.5 5.5H15a1.5 1.5 0 0 1 0 3h-1.7M9.5 11.5V15'), body(R(6.5, 15.5, 6, 2.5, 0.8)), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('soccer-bolt', 'Instant Soccer', ['quick', 'fast', 'instant', 'soccer', 'soccer'], [body(C(9.5, 10, 6.5)), line(poly([[9.5, 7.6], [11.8, 9.3], [10.9, 12], [8.1, 12], [7.2, 9.3]], 0.3, true)), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('pool-bolt', 'Instant Pool', ['quick', 'fast', 'instant', 'pool', 'pool'], [line('M6.5 3.5v8.5M11.5 3.5v8.5M6.5 6h5M6.5 9h5'), line('M3 14.5c1.2-1 2.3-1 3.5 0s2.3 1 3.5 0 2.3-1 3.5 0'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
