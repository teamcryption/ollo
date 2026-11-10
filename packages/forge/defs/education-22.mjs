import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'education',
  icons: [
    icon('cap-star', 'Honours', ['distinction', 'top student', 'graduation', 'education', 'cap'], [body(poly([[2.5, 8], [9.5, 4.5], [16.5, 8], [9.5, 11.5]], 0.6, true)), line('M5.5 9.8v3c1.2 1.2 2.6 1.8 4 1.8s2.8-.6 4-1.8v-3'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('cap-search', 'Find a Course', ['course search', 'programmes', 'study', 'education', 'cap'], [body(poly([[2.5, 8], [9.5, 4.5], [16.5, 8], [9.5, 11.5]], 0.6, true)), line('M5.5 9.8v3c1.2 1.2 2.6 1.8 4 1.8s2.8-.6 4-1.8v-3'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('cap-pin', 'Campus Location', ['university map', 'college location', 'campus', 'education', 'cap'], [body(poly([[2.5, 8], [9.5, 4.5], [16.5, 8], [9.5, 11.5]], 0.6, true)), line('M5.5 9.8v3c1.2 1.2 2.6 1.8 4 1.8s2.8-.6 4-1.8v-3'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('cap-clock', 'Exam Schedule', ['exam time', 'timetable', 'semester', 'education', 'cap'], [body(poly([[2.5, 8], [9.5, 4.5], [16.5, 8], [9.5, 11.5]], 0.6, true)), line('M5.5 9.8v3c1.2 1.2 2.6 1.8 4 1.8s2.8-.6 4-1.8v-3'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
  ],
};
