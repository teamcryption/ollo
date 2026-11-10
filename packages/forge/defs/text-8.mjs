import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'text',
  icons: [
    icon('copyright', 'Copyright', ['copyright sign', 'rights', 'legal', 'license', 'ownership'], [line(C(12, 12, 8.5)), line('M14.5 9.5a3.5 3.5 0 1 0 0 5')], { noAccent: true }),
    icon('registered', 'Registered', ['registered trademark', 'brand', 'legal', 'trademark', 'r symbol'], [line(C(12, 12, 8.5)), line('M10 16.5v-9h3a2.25 2.25 0 0 1 0 4.5h-3m3 0 2.5 4.5')], { noAccent: true }),
  ],
};
