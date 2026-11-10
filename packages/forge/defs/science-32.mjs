import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'science',
  icons: [
    icon('test-tube-download', 'Download Test Tube', ['download', 'save', 'export', 'test tube', 'test-tube'], [line(rotateD('M7 3.5h5', 30, 9.5, 10.5)), body(rotateD('M8 3.7h3v11a1.5 1.5 0 0 1-3 0Z', 30, 9.5, 10.5)), line(rotateD('M8.2 10h2.6', 30, 9.5, 10.5)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('test-tube-pencil', 'Edit Test Tube', ['edit', 'write', 'modify', 'test tube', 'test-tube'], [line(rotateD('M7 3.5h5', 30, 9.5, 10.5)), body(rotateD('M8 3.7h3v11a1.5 1.5 0 0 1-3 0Z', 30, 9.5, 10.5)), line(rotateD('M8.2 10h2.6', 30, 9.5, 10.5)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
