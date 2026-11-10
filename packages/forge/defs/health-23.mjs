import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'health',
  icons: [
    icon('otoscope', 'Otoscope', ['ear exam', 'doctor', 'ent', 'checkup', 'medical device'], [body(R(8, 6, 6.5, 4.5, 1.5)), body(poly([[14.5, 6.8], [19.5, 7.5], [19.5, 9], [14.5, 9.7]], 0.5, true)), body(R(9, 11.5, 4.5, 9, 1.5))], { noAccent: true }),
    icon('test-strip', 'Test Cassette', ['rapid test', 'lateral flow', 'covid test', 'diagnostic', 'result'], [body(R(3.5, 8.5, 17, 7, 2)), line(R(7, 10.5, 6, 3, 1)), line('M9 10.7v2.6M11 10.7v2.6'), line(C(16.5, 12, 1.5))], { noAccent: true }),
  ],
};
