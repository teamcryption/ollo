import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'education',
  icons: [
    icon('cap-shield', 'Graduation Protection', ['protected', 'secure', 'safety', 'graduation', 'cap'], [body(poly([[2.5, 8], [9.5, 4.5], [16.5, 8], [9.5, 11.5]], 0.6, true)), line('M5.5 9.8v3c1.2 1.2 2.6 1.8 4 1.8s2.8-.6 4-1.8v-3'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('cap-gear', 'Graduation Settings', ['settings', 'configure', 'preferences', 'graduation', 'cap'], [body(poly([[2.5, 8], [9.5, 4.5], [16.5, 8], [9.5, 11.5]], 0.6, true)), line('M5.5 9.8v3c1.2 1.2 2.6 1.8 4 1.8s2.8-.6 4-1.8v-3'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('book-bolt', 'Instant Book', ['quick', 'fast', 'instant', 'book', 'book'], [body(R(3, 4, 11, 15, 2)), line('M6 4.2v14.6'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('school-bolt', 'Instant School', ['quick', 'fast', 'instant', 'school', 'school'], [line('M9.5 6V2.8l2.5 1-2.5 1'), body(poly([[3, 11], [9.5, 6.5], [16, 11], [16, 19], [3, 19]], 1, true)), line('M8 19v-3.5h3V19'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('cap-bolt', 'Instant Graduation', ['quick', 'fast', 'instant', 'graduation', 'cap'], [body(poly([[2.5, 8], [9.5, 4.5], [16.5, 8], [9.5, 11.5]], 0.6, true)), line('M5.5 9.8v3c1.2 1.2 2.6 1.8 4 1.8s2.8-.6 4-1.8v-3'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
