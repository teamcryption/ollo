import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'business',
  icons: [
    icon('clipboard-star', 'Priority Checklist', ['important tasks', 'starred list', 'focus', 'clipboard', 'clipboard'], [body(R(4, 4.5, 10, 13, 2)), body(R(6.5, 3, 5, 2.5, 1), { cover: true }), line('M6.5 9h5M6.5 12h3'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
  ],
};
