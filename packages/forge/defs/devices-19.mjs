import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'devices',
  icons: [
    icon('no-laptops', 'No Laptops', ['laptops prohibited', 'no computers', 'exam', 'prohibited', 'sign'], [body(R(8, 8, 8, 6, 1)), line('M6.5 16.5h11'), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
    icon('no-flash', 'No Flash', ['flash photography prohibited', 'no flash', 'museum', 'prohibited', 'sign'], [body(poly([[13, 6.5], [9, 12.5], [12, 12.5], [11, 17.5], [15, 11], [12, 11]], 0.4, true)), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
  ],
};
