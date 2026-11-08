import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, D } from '../src/geo.mjs';

export default {
  category: 'education',
  icons: [
    icon('hand-bell', 'Hand Bell', ['school bell', 'ring', 'class', 'recess', 'bell'], [body(R(10.8, 3.5, 2.4, 4.5, 1.2)), body('M7 17c0-5 1.5-9 5-9s5 4 5 9Z'), line('M5.5 17h13'), accent(D(12, 19.4))], { anim: 'wiggle' }),
  ],
};
