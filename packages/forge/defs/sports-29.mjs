import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'sports',
  icons: [
    icon('no-cycling', 'No Cycling', ['bikes prohibited', 'bicycle', 'path', 'prohibited', 'sign'], [line(C(9, 14.5, 2.5) + C(15, 14.5, 2.5)), line('M9 14.5l2-4h3l1 4M11 10.5h-1'), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
    icon('no-skateboards', 'No Skateboarding', ['skateboards prohibited', 'skate', 'plaza', 'prohibited', 'sign'], [line('M6.5 11.5c.3.6.8.9 1.5.9h8c.7 0 1.2-.3 1.5-.9'), line(D(9.5, 14.5) + D(14.5, 14.5)), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
  ],
};
