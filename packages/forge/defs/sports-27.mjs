import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'sports',
  icons: [
    icon('pennant', 'Pennant', ['team flag', 'fan', 'banner', 'school spirit', 'victory'], [line('M5 3.5v17'), body(poly([[5.5, 5], [19.5, 8.5], [5.5, 12]], 0.8, true))], { noAccent: true }),
    icon('fishing-float', 'Fishing Float', ['bobber', 'fishing', 'angling', 'lake', 'bite'], [line('M12 8V3.5'), body(C(12, 13, 5)), line('M7.2 13h9.6'), accent('M3.5 20.5c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0')]),
  ],
};
