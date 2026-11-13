import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'weather',
  icons: [
    icon('weathervane-upload', 'Upload Weathervane', ['upload', 'send', 'export', 'weathervane', 'weathervane'], [line('M9.5 6v12.5M7 18.5h5'), line('M3.5 6h11'), body('M16 6l-2.5-2v4Z'), line('M3.5 4.5 5 6l-1.5 1.5'), line('M6.5 11h6'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
