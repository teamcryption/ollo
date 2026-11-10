import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'gaming',
  icons: [
    icon('suit-diamond', 'Diamond Suit', ['diamonds', 'playing card', 'poker', 'casino', 'cards'], [body(poly([[12, 3.5], [18.5, 12], [12, 20.5], [5.5, 12]], 1.5, true))], { noAccent: true }),
    icon('suit-club', 'Club Suit', ['clubs', 'playing card', 'poker', 'casino', 'cards'], [body(C(12, 7.5, 3)), body(C(7.5, 13, 3)), body(C(16.5, 13, 3)), body(poly([[12, 13], [14.5, 20.5], [9.5, 20.5]], 0.8, true))], { noAccent: true }),
  ],
};
