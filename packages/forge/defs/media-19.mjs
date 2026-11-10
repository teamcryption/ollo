import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'media',
  icons: [
    icon('knob', 'Knob', ['volume knob', 'dial', 'rotary control', 'gain', 'audio control'], [body(C(12, 12, 6)), line('M12 7.5v3'), accent('M5.07 16 4.03 16.6M5.07 8 4.03 7.4M12 4V2.8M18.93 8l1.04-.6M18.93 16l1.04.6')]),
  ],
};
