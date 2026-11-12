import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'notifications',
  icons: [
    icon('bell-stats', 'Bell Analytics', ['analytics', 'stats', 'report', 'bell', 'bell'], [body('M3.5 15h12l-1-1.6V9.5a5 5 0 0 0-10 0v3.9Z'), line('M8 17.5h3M9.5 3.5v.8'), body(R(13.3, 16.8, 2.2, 3.7, 0.6), { cover: true }), body(R(15.9, 14.8, 2.2, 5.7, 0.6), { cover: true }), body(R(18.5, 12.5, 2.2, 8, 0.6), { cover: true })], { noAccent: true }),
  ],
};
