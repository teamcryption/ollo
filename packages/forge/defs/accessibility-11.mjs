import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'accessibility',
  icons: [
    icon('wheelchair-bookmark', 'Save Wheelchair', ['save', 'bookmark', 'later', 'wheelchair', 'wheelchair'], [line(C(8.5, 4, 1.4)), line('M8.5 6.5V12h4.5l1.5 4.5h1.5'), line('M11.5 9H8.6'), line('M5.5 10.5a4.5 4.5 0 1 0 7 4'), body('M14.5 12.5h5v8l-2.5-1.8-2.5 1.8Z', { cover: true })], { noAccent: true }),
  ],
};
