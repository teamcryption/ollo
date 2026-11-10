import { icon, body, line } from '../src/dsl.mjs';
import { C, E, rotateD } from '../src/geo.mjs';

export default {
  category: 'sports',
  icons: [
    icon('fish-hook', 'Fish Hook', ['fishing', 'hook', 'angling', 'bait', 'catch'], [body(C(14, 4.5, 1.3)), line('M14 5.8v8.7a4 4 0 0 1-8 0V12l2.5 2.5')], { noAccent: true }),
  ],
};
