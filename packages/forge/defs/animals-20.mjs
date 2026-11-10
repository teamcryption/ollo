import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'animals',
  icons: [
    icon('dog-bowl', 'Pet Bowl', ['dog bowl', 'cat food', 'feeding', 'pet', 'kibble'], [line('M6.5 13c1-1.5 2.5-2 3.5-1.5 1-1 3-1 4 0 1-.5 2.5 0 3.5 1.5'), body('M4 13h16l-1.5 6a1.5 1.5 0 0 1-1.5 1H7a1.5 1.5 0 0 1-1.5-1Z')], { noAccent: true }),
    icon('pet-carrier', 'Pet Carrier', ['cat carrier', 'pet travel', 'crate', 'vet visit', 'pet'], [line('M9 8V6h6v2'), body(R(3.5, 8, 17, 12, 2)), line(R(6, 11, 7, 6, 1)), line('M8.3 11.2v5.6M10.7 11.2v5.6')], { noAccent: true }),
  ],
};
