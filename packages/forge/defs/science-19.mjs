import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'science',
  icons: [
    icon('flask-clock', 'Experiment Timer', ['lab timer', 'reaction time', 'science', 'flask', 'flask'], [body('M7 3.5h5v4l4 7.5a1.5 1.5 0 0 1-1.3 2.2H4.3A1.5 1.5 0 0 1 3 15l4-7.5Z'), line('M5.3 12h8.4'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('flask-search', 'Research', ['lab research', 'investigation', 'discovery', 'flask', 'flask'], [body('M7 3.5h5v4l4 7.5a1.5 1.5 0 0 1-1.3 2.2H4.3A1.5 1.5 0 0 1 3 15l4-7.5Z'), line('M5.3 12h8.4'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('flask-shield', 'Lab Safety', ['chemical safety', 'protection', 'lab rules', 'flask', 'flask'], [body('M7 3.5h5v4l4 7.5a1.5 1.5 0 0 1-1.3 2.2H4.3A1.5 1.5 0 0 1 3 15l4-7.5Z'), line('M5.3 12h8.4'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('flask-pin', 'Lab Location', ['laboratory site', 'research centre', 'map', 'flask', 'flask'], [body('M7 3.5h5v4l4 7.5a1.5 1.5 0 0 1-1.3 2.2H4.3A1.5 1.5 0 0 1 3 15l4-7.5Z'), line('M5.3 12h8.4'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
  ],
};
