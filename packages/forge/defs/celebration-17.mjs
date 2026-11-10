import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'celebration',
  icons: [
    icon('cake-heart', 'Birthday Love', ['celebration', 'special day', 'party', 'cake', 'cake'], [line('M9.5 9.5V6.5'), line(D(9.5, 4.8)), body(R(4, 10, 11, 7, 1.5)), line('M4.2 13c1.2 1 2.4 1 3.6 0s2.4-1 3.6 0 2.4 1 3.6 0'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
  ],
};
