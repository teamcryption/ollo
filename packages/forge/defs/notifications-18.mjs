import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'notifications',
  icons: [
    icon('bell-upload', 'Upload Bell', ['upload', 'send', 'export', 'bell', 'bell'], [body('M3.5 15h12l-1-1.6V9.5a5 5 0 0 0-10 0v3.9Z'), line('M8 17.5h3M9.5 3.5v.8'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
