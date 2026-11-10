import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'design',
  icons: [
    icon('cube-pencil', 'Edit 3D Cube', ['edit', 'write', 'modify', '3d cube', 'cube'], [body(poly([[9.5, 3], [16, 6.7], [16, 14.3], [9.5, 18], [3, 14.3], [3, 6.7]], 0.8, true)), line('M3.3 6.9l6.2 3.6 6.2-3.6M9.5 10.6v7.1'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
