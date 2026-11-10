import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'sports',
  icons: [
    icon('whistle-download', 'Download Whistle', ['download', 'save', 'export', 'whistle', 'whistle'], [line('M5.6 9.4 4 6'), body('M8.5 8.5h7V12h-3.4A3.8 3.8 0 1 1 8.5 8.5Z'), line(D(8.3, 12.3)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
  ],
};
