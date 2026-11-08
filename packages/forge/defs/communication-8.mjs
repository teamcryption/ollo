import { icon, body, line, accent } from '../src/dsl.mjs';
import { C, A } from '../src/geo.mjs';

export default {
  category: 'communication',
  icons: [
    icon('cell-tower', 'Cell Tower', ['mast', 'signal', 'mobile network', 'antenna', 'transmitter'], [line('M12 9 7.5 20.5M12 9l4.5 11.5M9.3 16h5.4'), body(C(12, 7.5, 1.6)), accent(A(12, 7.5, 4, 140, 220) + A(12, 7.5, 4, -40, 40)), line(A(12, 7.5, 7, 145, 215)), line(A(12, 7.5, 7, -35, 35))], { anim: 'pulse' }),
  ],
};
