import { R, C, L, E, poly, D, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const ORBIT = E(12, 12, 9, 3.5);
const TUBE = [body('M9.5 3.5h5v13a2.5 2.5 0 0 1-5 0Z'), line(L(9.7, 10.5, 14.3, 10.5))];

export default {
  category: 'science',
  icons: [
    icon('flask', 'Flask', ['chemistry', 'lab', 'experiment', 'science', 'potion'], [body('M10 3.5h4v6l5.2 8.5a2 2 0 0 1-1.7 3h-11a2 2 0 0 1-1.7-3L10 9.5Z'), line(L(6.8, 15, 17.2, 15)), accent(D(11, 18))], { anim: 'wiggle' }),
    icon('test-tube', 'Test Tube', ['lab', 'sample', 'chemistry', 'experiment'], TUBE.map((e) => ({ ...e, d: rotateD(e.d, 30) })), { noAccent: true }),
    icon('atom', 'Atom', ['physics', 'science', 'nuclear', 'molecule'], [line(rotateD(ORBIT, 45)), line(rotateD(ORBIT, -45)), body(C(12, 12, 1.6))], { noAccent: true, anim: 'spin' }),
    icon('magnet', 'Magnet', ['attract', 'magnetic', 'physics', 'pull'], [body(R(4.5, 4, 3, 4, 0.8)), body(R(16.5, 4, 3, 4, 0.8)), line('M6 8v4a6 6 0 0 0 12 0V8')], { noAccent: true }),
    icon('beaker', 'Beaker', ['lab', 'measure', 'chemistry', 'liquid'], [body('M5 4h14l-1.5 1.5V19a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 19V5.5Z'), line(L(6.7, 9, 9.5, 9)), line(L(6.7, 13, 9.5, 13)), line(L(6.7, 17, 9.5, 17))], { noAccent: true }),
  ],
};
