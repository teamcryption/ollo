import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'devices',
  icons: [
    icon('no-drones', 'No Drones', ['drones prohibited', 'no fly zone', 'uav', 'prohibited', 'sign'], [line(C(8.5, 8.5, 1.5) + C(15.5, 8.5, 1.5) + C(8.5, 15.5, 1.5) + C(15.5, 15.5, 1.5)), body(R(10.5, 10.5, 3, 3, 0.8)), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
  ],
};
