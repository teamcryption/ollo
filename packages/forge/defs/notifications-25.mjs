import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'notifications',
  icons: [
    icon('bell-camera', 'Bell Photo', ['photo', 'camera', 'picture', 'bell', 'bell'], [body('M3.5 15h12l-1-1.6V9.5a5 5 0 0 0-10 0v3.9Z'), line('M8 17.5h3M9.5 3.5v.8'), body('M13 15.2a1.2 1.2 0 0 1 1.2-1.2h1.2l.8-1.2h2.6l.8 1.2h1.2a1.2 1.2 0 0 1 1.2 1.2v4.1a1.2 1.2 0 0 1-1.2 1.2h-5.6a1.2 1.2 0 0 1-1.2-1.2Z', { cover: true }), line(C(17, 17.2, 1.4))], { noAccent: true }),
    icon('bell-filter', 'Filter Bell', ['filter', 'sort', 'refine', 'bell', 'bell'], [body('M3.5 15h12l-1-1.6V9.5a5 5 0 0 0-10 0v3.9Z'), line('M8 17.5h3M9.5 3.5v.8'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
