import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'accessibility',
  icons: [
    icon('wheelchair-camera', 'Wheelchair Photo', ['photo', 'camera', 'picture', 'wheelchair', 'wheelchair'], [line(C(8.5, 4, 1.4)), line('M8.5 6.5V12h4.5l1.5 4.5h1.5'), line('M11.5 9H8.6'), line('M5.5 10.5a4.5 4.5 0 1 0 7 4'), body('M13 15.2a1.2 1.2 0 0 1 1.2-1.2h1.2l.8-1.2h2.6l.8 1.2h1.2a1.2 1.2 0 0 1 1.2 1.2v4.1a1.2 1.2 0 0 1-1.2 1.2h-5.6a1.2 1.2 0 0 1-1.2-1.2Z', { cover: true }), line(C(17, 17.2, 1.4))], { noAccent: true }),
    icon('wheelchair-filter', 'Filter Wheelchair', ['filter', 'sort', 'refine', 'wheelchair', 'wheelchair'], [line(C(8.5, 4, 1.4)), line('M8.5 6.5V12h4.5l1.5 4.5h1.5'), line('M11.5 9H8.6'), line('M5.5 10.5a4.5 4.5 0 1 0 7 4'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
