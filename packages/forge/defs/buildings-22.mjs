import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'buildings',
  icons: [
    icon('factory-bolt', 'Instant Factory', ['quick', 'fast', 'instant', 'factory', 'factory'], [body(poly([[3, 16.5], [3, 9], [7, 11], [7, 9], [11, 11], [11, 4.5], [15.5, 4.5], [15.5, 16.5]], 0.8, true)), line('M6 14h2M10 14h2'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
