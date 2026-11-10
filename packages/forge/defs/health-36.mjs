import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'health',
  icons: [
    icon('thermometer-search', 'Search Thermometer', ['search', 'find', 'lookup', 'thermometer', 'thermometer'], [body('M8 4.5a1.5 1.5 0 0 1 3 0v7.3a3 3 0 1 1-3 0Z'), line('M9.5 8v5.5'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('thermometer-clock', 'Thermometer Schedule', ['schedule', 'time', 'history', 'thermometer', 'thermometer'], [body('M8 4.5a1.5 1.5 0 0 1 3 0v7.3a3 3 0 1 1-3 0Z'), line('M9.5 8v5.5'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('thermometer-shield', 'Thermometer Protection', ['protected', 'secure', 'safety', 'thermometer', 'thermometer'], [body('M8 4.5a1.5 1.5 0 0 1 3 0v7.3a3 3 0 1 1-3 0Z'), line('M9.5 8v5.5'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('thermometer-gear', 'Thermometer Settings', ['settings', 'configure', 'preferences', 'thermometer', 'thermometer'], [body('M8 4.5a1.5 1.5 0 0 1 3 0v7.3a3 3 0 1 1-3 0Z'), line('M9.5 8v5.5'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('thermometer-pin', 'Thermometer Location', ['location', 'place', 'map', 'thermometer', 'thermometer'], [body('M8 4.5a1.5 1.5 0 0 1 3 0v7.3a3 3 0 1 1-3 0Z'), line('M9.5 8v5.5'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('thermometer-bolt', 'Instant Thermometer', ['quick', 'fast', 'instant', 'thermometer', 'thermometer'], [body('M8 4.5a1.5 1.5 0 0 1 3 0v7.3a3 3 0 1 1-3 0Z'), line('M9.5 8v5.5'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('thermometer-heart', 'Favourite Thermometer', ['favourite', 'saved', 'like', 'thermometer', 'thermometer'], [body('M8 4.5a1.5 1.5 0 0 1 3 0v7.3a3 3 0 1 1-3 0Z'), line('M9.5 8v5.5'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('thermometer-star', 'Featured Thermometer', ['featured', 'top rated', 'best', 'thermometer', 'thermometer'], [body('M8 4.5a1.5 1.5 0 0 1 3 0v7.3a3 3 0 1 1-3 0Z'), line('M9.5 8v5.5'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
  ],
};
