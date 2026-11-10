import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'sports',
  icons: [
    icon('no-fishing', 'No Fishing', ['fishing prohibited', 'angling', 'lake', 'prohibited', 'sign'], [line('M13.5 7v6.5a2.5 2.5 0 0 1-5 0v-1l1.5 1'), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
    icon('no-ball-games', 'No Ball Games', ['ball games prohibited', 'park', 'play', 'prohibited', 'sign'], [body(C(12, 12, 4)), line('M8.3 11.2c2.5 1 5 1 7.4 0'), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
  ],
};
