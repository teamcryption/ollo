import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'business',
  icons: [
    icon('clipboard-list', 'Checklist Clipboard', ['task list', 'clipboard', 'agenda', 'to do', 'inventory'], [body(R(5, 4.5, 14, 16.5, 2.5)), body(R(9, 3, 6, 3.5, 1.5), { cover: true }), line('M8.5 10.5h1M11.5 10.5h4M8.5 14h1M11.5 14h4'), accent('M8.5 17.5h1M11.5 17.5h2.5')]),
  ],
};
