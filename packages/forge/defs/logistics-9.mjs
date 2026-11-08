import { icon, body, line } from '../src/dsl.mjs';
import { C, E, poly, rotateD } from '../src/geo.mjs';

export default {
  category: 'logistics',
  icons: [
    icon('cement-mixer', 'Cement Mixer', ['concrete truck', 'mixer', 'construction', 'truck', 'building site'], [body(rotateD(E(8.5, 11, 5.5, 3.8), -15, 8.5, 11)), body(poly([[15, 8.5], [18.5, 8.5], [21, 12.5], [21, 17], [15, 17]], 1, true)), line('M3 17h12'), body(C(6.5, 18.5, 2), { cover: true }), body(C(17.5, 18.5, 2), { cover: true })], { noAccent: true }),
  ],
};
