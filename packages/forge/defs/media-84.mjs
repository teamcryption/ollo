import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'media',
  icons: [
    icon('camera-2', 'Camera Alt', ['photo', 'picture', 'capture', 'snapshot'], [body('M3 8.5A2 2 0 0 1 5 6.5h2l1.5-2h7l1.5 2h2a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z'), line(C(12, 13, 3.5)), accent(L(17, 9.5, 18.5, 9.5))]),
    icon('camera-3', 'Camera Compact', ['photo', 'picture', 'compact', 'lens'], [body(R(3, 6.5, 18, 13, 3)), line(C(14, 13, 3.5)), line(L(6, 10, 8, 10)), accent(L(6, 4.5, 9, 4.5))]),
  ],
};
