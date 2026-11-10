import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'travel',
  icons: [
    icon('camping-stove', 'Camping Stove', ['camp stove', 'portable burner', 'outdoor cooking', 'hiking', 'gas stove'], [body('M12 4.5c2 2.5 3 4 3 5.5a3 3 0 0 1-6 0c0-1.5 1-3 3-5.5Z'), body(R(6, 15, 12, 3, 1.5)), line('M7 18l-1.5 2.5M17 18l1.5 2.5')], { noAccent: true }),
  ],
};
