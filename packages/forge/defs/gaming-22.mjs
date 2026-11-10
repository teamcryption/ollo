import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'gaming',
  icons: [
    icon('dice-six', 'Dice Six', ['die', 'roll', 'six', 'board game', 'chance'], [body(R(3.5, 3.5, 17, 17, 4)), line(D(8, 7.5) + D(16, 7.5) + D(8, 12) + D(16, 12) + D(8, 16.5) + D(16, 16.5))], { noAccent: true }),
  ],
};
