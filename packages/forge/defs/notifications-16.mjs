import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'notifications',
  icons: [
    icon('bell-flag', 'Report Bell', ['report', 'flag', 'mark', 'bell', 'bell'], [body('M3.5 15h12l-1-1.6V9.5a5 5 0 0 0-10 0v3.9Z'), line('M8 17.5h3M9.5 3.5v.8'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
  ],
};
