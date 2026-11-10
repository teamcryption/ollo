import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'food',
  icons: [
    icon('ice-cube', 'Ice Cubes', ['ice', 'cold drink', 'frozen', 'chill', 'cubes'], [body(rotateD(R(3.5, 9, 10, 10, 2.5), -12, 8.5, 14)), body(rotateD(R(11, 4, 9.5, 9.5, 2.5), 10, 15.75, 8.75), { cover: true })], { noAccent: true }),
  ],
};
