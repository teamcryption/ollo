import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'accessibility',
  icons: [
    icon('wheelchair-crown', 'Premium Wheelchair', ['premium', 'pro', 'vip', 'wheelchair', 'wheelchair'], [line(C(8.5, 4, 1.4)), line('M8.5 6.5V12h4.5l1.5 4.5h1.5'), line('M11.5 9H8.6'), line('M5.5 10.5a4.5 4.5 0 1 0 7 4'), body(poly([[13, 20], [13, 14], [15.3, 16.3], [17, 13], [18.7, 16.3], [21, 14], [21, 20]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('wheelchair-moon', 'Wheelchair Night Mode', ['night', 'dark mode', 'sleep', 'wheelchair', 'wheelchair'], [line(C(8.5, 4, 1.4)), line('M8.5 6.5V12h4.5l1.5 4.5h1.5'), line('M11.5 9H8.6'), line('M5.5 10.5a4.5 4.5 0 1 0 7 4'), body('M20.5 18.7A4 4 0 0 1 16 12.6a4.2 4.2 0 1 0 4.5 6.1Z', { cover: true })], { noAccent: true }),
  ],
};
