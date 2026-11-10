import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'health',
  icons: [
    icon('cigarette', 'Cigarette', ['smoking', 'tobacco', 'smoke', 'cigarette', 'nicotine'], [body(R(3.5, 13, 17, 3.5, 0.8)), line('M15.5 13.2v3.1'), accent('M17 10c0-1.2 1-1.5 1-2.8M19.5 10c0-1.2 1-1.5 1-2.8')]),
  ],
};
