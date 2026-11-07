import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'social',
  icons: [
    icon('live-badge', 'Live', ['live', 'streaming', 'on air', 'broadcast'], [body(R(3, 7, 18, 10, 2.5)), accent(D(7, 12)), line(L(10, 12, 17.5, 12))], { anim: 'pulse' }),
  ],
};
