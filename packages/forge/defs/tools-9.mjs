import { icon, body, line } from '../src/dsl.mjs';
import { R, poly, rotateD } from '../src/geo.mjs';

const CHISEL = [body(R(10, 3, 4, 7.5, 1.5)), line('M10 11.5h4'), body(poly([[10.5, 12.5], [13.5, 12.5], [13.5, 19], [12, 21], [10.5, 19]], 0.5, true))];

export default {
  category: 'tools',
  icons: [
    icon('chisel', 'Chisel', ['woodwork', 'carving', 'carpentry', 'tool', 'craft'], CHISEL.map((e) => ({ ...e, d: rotateD(e.d, 45) })), { noAccent: true }),
  ],
};
