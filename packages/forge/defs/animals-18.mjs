import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'animals',
  icons: [
    icon('seagull', 'Seagull', ['gull', 'birds', 'sea bird', 'coast', 'flying'], [line('M3.5 9c2.5-1.5 5.5-1 8.5 2.5 3-3.5 6-4 8.5-2.5'), accent('M13 16.5c1-.7 2.3-.5 3.5.8 1.2-1.3 2.5-1.5 3.5-.8')]),
  ],
};
