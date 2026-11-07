import { R, L } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'navigation',
  icons: [
    icon('barrier', 'Road Barrier', ['roadblock', 'detour', 'closed road', 'construction', 'blocked'], [line(L(6, 12, 6, 20.5)), line(L(18, 12, 18, 20.5)), body(R(3.5, 7, 17, 5, 1)), line('M8.5 7.2 6 11.8M13.5 7.2 11 11.8M18.5 7.2 16 11.8')], { noAccent: true }),
  ],
};
