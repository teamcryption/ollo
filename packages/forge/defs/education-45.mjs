import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'education',
  icons: [
    icon('math-symbols-pause', 'Pause Math Symbols', ['pause', 'hold', 'stop', 'math symbols', 'math-symbols'], [line('M6 3.5v5M3.5 6h5M11 6h5M3.8 13.2l4.4 4.4M8.2 13.2l-4.4 4.4M11 14h5M11 17h5'), body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })], { noAccent: true }),
    icon('book-leaf', 'Eco Book', ['eco', 'green', 'sustainable', 'book', 'book'], [body(R(3, 4, 11, 15, 2)), line('M6 4.2v14.6'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('school-leaf', 'Eco School', ['eco', 'green', 'sustainable', 'school', 'school'], [line('M9.5 6V2.8l2.5 1-2.5 1'), body(poly([[3, 11], [9.5, 6.5], [16, 11], [16, 19], [3, 19]], 1, true)), line('M8 19v-3.5h3V19'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('cap-leaf', 'Eco Graduation', ['eco', 'green', 'sustainable', 'graduation', 'cap'], [body(poly([[2.5, 8], [9.5, 4.5], [16.5, 8], [9.5, 11.5]], 0.6, true)), line('M5.5 9.8v3c1.2 1.2 2.6 1.8 4 1.8s2.8-.6 4-1.8v-3'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('drawing-compass-leaf', 'Eco Drawing Compass', ['eco', 'green', 'sustainable', 'drawing compass', 'drawing-compass'], [body(C(9.5, 4.5, 1.5)), line('M8.8 5.9 4.5 17.5M10.2 5.9l4.3 11.6'), line('M5.6 14.4c2.5 1.3 5.3 1.3 7.8 0'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('whiteboard-leaf', 'Eco Whiteboard', ['eco', 'green', 'sustainable', 'whiteboard', 'whiteboard'], [body(R(3, 3.5, 13, 9, 1.2)), line('M5.5 7l2-1.3 2 1.8 2.5-2.5'), line('M6.5 12.7 5 18M12.5 12.7 14 18'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
  ],
};
