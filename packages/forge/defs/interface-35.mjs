import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'interface',
  icons: [
    icon('link-bolt', 'Quick Link', ['shortcut', 'fast link', 'instant share', 'url', 'link'], [line('M7.5 11.5 11.5 7.5M6.5 9 5 10.5a2.5 2.5 0 0 0 3.5 3.5L10 12.5M10 6.5 11.5 5a2.5 2.5 0 0 1 3.5 3.5L13.5 10'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
