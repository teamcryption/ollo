import { R, C, L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'home',
  icons: [
    icon('doorbell', 'Doorbell', ['bell', 'ring', 'visitor', 'door', 'chime'], [body(R(6.5, 3.5, 11, 17, 2)), line(L(10, 7, 14, 7)), line(C(12, 13.5, 3.2)), accent(C(12, 13.5, 1))], { anim: 'pulse' }),
  ],
};
