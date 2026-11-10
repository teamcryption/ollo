import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'media',
  icons: [
    icon('no-headphones', 'No Headphones', ['headphones prohibited', 'audio', 'quiet', 'prohibited', 'sign'], [line('M8 14v-2a4 4 0 0 1 8 0v2'), body(R(7, 13.5, 2.5, 4, 1)), body(R(14.5, 13.5, 2.5, 4, 1)), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
    icon('no-photos', 'No Photos', ['photography prohibited', 'camera', 'museum', 'prohibited', 'sign'], [body('M7.5 9.5h2l1-1.5h3l1 1.5h2v6.5h-9Z'), line(C(12, 12.7, 1.6)), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
  ],
};
