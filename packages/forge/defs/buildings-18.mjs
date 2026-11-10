import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'buildings',
  icons: [
    icon('greek-column', 'Column', ['pillar', 'greek', 'classical', 'museum', 'architecture'], [body(R(5, 4, 14, 3, 1)), line('M7.5 7v10M10.5 7v10M13.5 7v10M16.5 7v10'), body(R(5, 17, 14, 3, 1))], { noAccent: true }),
  ],
};
