import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'media',
  icons: [
    icon('cassette-download', 'Download Cassette', ['download', 'save', 'export', 'cassette', 'cassette'], [body(R(3, 5.5, 13, 10, 1.5)), line(C(7, 9.5, 1.3) + C(12, 9.5, 1.3)), line('M6 15.3l1-2.3h5l1 2.3'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('clapperboard-pencil', 'Edit Clapperboard', ['edit', 'write', 'modify', 'clapperboard', 'clapperboard'], [body(rotateD(R(3.5, 5, 12, 2.6, 0.6), -14, 3.5, 7.6)), body(R(3.5, 8.8, 12, 8.7, 1.5)), line('M3.7 11.6h11.6'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
