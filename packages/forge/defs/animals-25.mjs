import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'animals',
  icons: [
    icon('fish-search', 'Search Fish', ['search', 'find', 'lookup', 'fish', 'fish'], [body('M5 10.5c1.8-2.8 4.2-4.3 7-4.3 1.8 0 3.2 1.4 4 4.3-.8 2.9-2.2 4.3-4 4.3-2.8 0-5.2-1.5-7-4.3Z'), line('M5 10.5 3 8M5 10.5 3 13'), line(D(12.8, 9.6)), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('fish-clock', 'Fish Schedule', ['schedule', 'time', 'history', 'fish', 'fish'], [body('M5 10.5c1.8-2.8 4.2-4.3 7-4.3 1.8 0 3.2 1.4 4 4.3-.8 2.9-2.2 4.3-4 4.3-2.8 0-5.2-1.5-7-4.3Z'), line('M5 10.5 3 8M5 10.5 3 13'), line(D(12.8, 9.6)), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('fish-shield', 'Fish Protection', ['protected', 'secure', 'safety', 'fish', 'fish'], [body('M5 10.5c1.8-2.8 4.2-4.3 7-4.3 1.8 0 3.2 1.4 4 4.3-.8 2.9-2.2 4.3-4 4.3-2.8 0-5.2-1.5-7-4.3Z'), line('M5 10.5 3 8M5 10.5 3 13'), line(D(12.8, 9.6)), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('fish-gear', 'Fish Settings', ['settings', 'configure', 'preferences', 'fish', 'fish'], [body('M5 10.5c1.8-2.8 4.2-4.3 7-4.3 1.8 0 3.2 1.4 4 4.3-.8 2.9-2.2 4.3-4 4.3-2.8 0-5.2-1.5-7-4.3Z'), line('M5 10.5 3 8M5 10.5 3 13'), line(D(12.8, 9.6)), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('fish-pin', 'Fish Location', ['location', 'place', 'map', 'fish', 'fish'], [body('M5 10.5c1.8-2.8 4.2-4.3 7-4.3 1.8 0 3.2 1.4 4 4.3-.8 2.9-2.2 4.3-4 4.3-2.8 0-5.2-1.5-7-4.3Z'), line('M5 10.5 3 8M5 10.5 3 13'), line(D(12.8, 9.6)), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('fish-bolt', 'Instant Fish', ['quick', 'fast', 'instant', 'fish', 'fish'], [body('M5 10.5c1.8-2.8 4.2-4.3 7-4.3 1.8 0 3.2 1.4 4 4.3-.8 2.9-2.2 4.3-4 4.3-2.8 0-5.2-1.5-7-4.3Z'), line('M5 10.5 3 8M5 10.5 3 13'), line(D(12.8, 9.6)), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('fish-heart', 'Favourite Fish', ['favourite', 'saved', 'like', 'fish', 'fish'], [body('M5 10.5c1.8-2.8 4.2-4.3 7-4.3 1.8 0 3.2 1.4 4 4.3-.8 2.9-2.2 4.3-4 4.3-2.8 0-5.2-1.5-7-4.3Z'), line('M5 10.5 3 8M5 10.5 3 13'), line(D(12.8, 9.6)), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('fish-star', 'Featured Fish', ['featured', 'top rated', 'best', 'fish', 'fish'], [body('M5 10.5c1.8-2.8 4.2-4.3 7-4.3 1.8 0 3.2 1.4 4 4.3-.8 2.9-2.2 4.3-4 4.3-2.8 0-5.2-1.5-7-4.3Z'), line('M5 10.5 3 8M5 10.5 3 13'), line(D(12.8, 9.6)), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('fish-alert', 'Fish Alert', ['alert', 'warning', 'problem', 'fish', 'fish'], [body('M5 10.5c1.8-2.8 4.2-4.3 7-4.3 1.8 0 3.2 1.4 4 4.3-.8 2.9-2.2 4.3-4 4.3-2.8 0-5.2-1.5-7-4.3Z'), line('M5 10.5 3 8M5 10.5 3 13'), line(D(12.8, 9.6)), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
  ],
};
