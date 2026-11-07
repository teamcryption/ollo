import { E, L } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'travel',
  icons: [
    icon('match', 'Match', ['matchstick', 'fire', 'light', 'flame', 'camping', 'ignite'], [line('M12 3c2.5 2.5 4 4.5 4 7a4 4 0 0 1-8 0c0-2.5 1.5-4.5 4-7Z'), body(E(12, 10.2, 1.6, 2)), line(L(12, 14, 12, 20.5))], { noAccent: true }),
  ],
};
