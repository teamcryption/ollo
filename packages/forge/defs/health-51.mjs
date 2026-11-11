import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'health',
  icons: [
    icon('heart-monitor-pencil', 'Edit Heart Monitor', ['edit', 'write', 'modify', 'heart monitor', 'heart-monitor'], [body(R(3, 4, 13, 10, 1.8)), line('M5 9.5h2.5l1.2-2.5 2 5 1.3-2.5H14'), line('M7 17.5h5M9.5 14.2v3'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('x-ray-pencil', 'Edit X-ray', ['edit', 'write', 'modify', 'x-ray', 'x-ray'], [body(R(3.5, 3.5, 12, 14, 1.8)), line('M9.5 6v9M7 8h5M6.5 10.5h6M7 13h5'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
