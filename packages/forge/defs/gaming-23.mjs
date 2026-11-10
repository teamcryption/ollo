import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'gaming',
  icons: [
    icon('jack-in-box', 'Jack in the Box', ['toy', 'surprise', 'spring toy', 'kids', 'clown box'], [body(C(12, 5, 2.2)), line('M12 13l-2-1.3 4-1.3-4-1.3 2-1.3'), body(R(5, 13, 14, 7.5, 1.5))], { noAccent: true }),
  ],
};
