import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, star, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'devices',
  icons: [
    icon('trackball', 'Trackball', ['mouse', 'pointer', 'ergonomic', 'input', 'computer'], [body('M4 15c0-4 3.5-7 8-7s8 3 8 7v2.5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Z'), line(C(12, 13.5, 3))], { noAccent: true }),
    icon('robot-arm', 'Robot Arm', ['industrial robot', 'automation', 'manufacturing', 'robotics', 'factory'], [body(R(4, 18, 8, 2.5, 1)), line('M8 18v-6l6-5'), body(C(8, 12, 1.6)), body(C(14, 7, 1.6)), line('M15.5 7.5 19.5 9M15 5.5l3-2.5')], { noAccent: true }),
  ],
};
