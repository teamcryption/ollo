import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, star, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));


export default {
  category: 'communication',
  icons: [
    icon('telegraph', 'Telegraph', ['morse code', 'telegraph key', 'signal', 'vintage', 'message'], [body(R(3.5, 15.5, 17, 4.5, 1.5)), line('M5.5 12.5H16M8 12.5v3'), body(C(18, 12.5, 2)), accent('M5 8h3' + D(10.5, 8))]),
  ],
};
