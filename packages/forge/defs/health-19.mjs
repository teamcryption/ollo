import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'health',
  icons: [
    icon('contact-lens', 'Contact Lens', ['lens', 'eye care', 'vision', 'optician', 'eyesight'], [body('M4 15.5C4 10.3 7.6 6.5 12 6.5s8 3.8 8 9c-2.5 1.3-5.2 2-8 2s-5.5-.7-8-2Z'), accent(A(12, 13, 4.5, 220, 270))]),
  ],
};
