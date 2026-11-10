import { icon, body, line } from '../src/dsl.mjs';
import { C, E, rotateD } from '../src/geo.mjs';

export default {
  category: 'science',
  icons: [
    icon('saturn', 'Saturn', ['planet', 'rings', 'space', 'astronomy', 'solar system'], [body(C(12, 12, 5.5)), line(rotateD(E(12, 12, 9, 3), -20))], { noAccent: true, anim: 'spin' }),
  ],
};
