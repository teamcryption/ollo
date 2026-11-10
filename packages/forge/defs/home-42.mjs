import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'home',
  icons: [
    icon('lamp-search', 'Search Lamp', ['search', 'find', 'lookup', 'lamp', 'lamp'], [body('M6 3.5h7l2 6H4Z'), line('M9.5 9.7V17M6 17.5h7'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('lamp-clock', 'Lamp Schedule', ['schedule', 'time', 'history', 'lamp', 'lamp'], [body('M6 3.5h7l2 6H4Z'), line('M9.5 9.7V17M6 17.5h7'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('lamp-shield', 'Lamp Protection', ['protected', 'secure', 'safety', 'lamp', 'lamp'], [body('M6 3.5h7l2 6H4Z'), line('M9.5 9.7V17M6 17.5h7'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('lamp-gear', 'Lamp Settings', ['settings', 'configure', 'preferences', 'lamp', 'lamp'], [body('M6 3.5h7l2 6H4Z'), line('M9.5 9.7V17M6 17.5h7'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('lamp-pin', 'Lamp Location', ['location', 'place', 'map', 'lamp', 'lamp'], [body('M6 3.5h7l2 6H4Z'), line('M9.5 9.7V17M6 17.5h7'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('lamp-bolt', 'Instant Lamp', ['quick', 'fast', 'instant', 'lamp', 'lamp'], [body('M6 3.5h7l2 6H4Z'), line('M9.5 9.7V17M6 17.5h7'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('lamp-heart', 'Favourite Lamp', ['favourite', 'saved', 'like', 'lamp', 'lamp'], [body('M6 3.5h7l2 6H4Z'), line('M9.5 9.7V17M6 17.5h7'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('lamp-star', 'Featured Lamp', ['featured', 'top rated', 'best', 'lamp', 'lamp'], [body('M6 3.5h7l2 6H4Z'), line('M9.5 9.7V17M6 17.5h7'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('lamp-alert', 'Lamp Alert', ['alert', 'warning', 'problem', 'lamp', 'lamp'], [body('M6 3.5h7l2 6H4Z'), line('M9.5 9.7V17M6 17.5h7'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
  ],
};
