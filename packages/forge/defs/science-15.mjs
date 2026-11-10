import { icon, body, line } from '../src/dsl.mjs';
import { C } from '../src/geo.mjs';

export default {
  category: 'science',
  icons: [
    icon('orbit', 'Orbit', ['satellite orbit', 'moon', 'planet', 'trajectory', 'space'], [body(C(12, 12, 3.5)), line(C(12, 12, 8)), body(C(17.7, 6.3, 1.6), { cover: true })], { noAccent: true, anim: 'spin' }),
  ],
};
