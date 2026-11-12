import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'accessibility',
  icons: [
    icon('wheelchair-cursor', 'Select Wheelchair', ['select', 'click', 'pointer', 'wheelchair', 'wheelchair'], [line(C(8.5, 4, 1.4)), line('M8.5 6.5V12h4.5l1.5 4.5h1.5'), line('M11.5 9H8.6'), line('M5.5 10.5a4.5 4.5 0 1 0 7 4'), body(poly([[13.6, 12.6], [20.6, 15.6], [17.6, 16.8], [16.4, 20.2]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
