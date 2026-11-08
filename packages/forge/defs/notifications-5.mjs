import { L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const BELL = 'M6.5 15.5V11a5.5 5.5 0 0 1 11 0v4.5l1.1 1.3c.4.5.1 1.2-.6 1.2H6c-.7 0-1-.7-.6-1.2Z';
const CLAPPER = 'M10 20.2a2.2 2.2 0 0 0 4 0';

export default {
  category: 'notifications',
  icons: [
    icon('bell-minus', 'Bell Remove', ['unsubscribe', 'remove notification', 'fewer alerts', 'mute'], [body(BELL), accent(CLAPPER), line(L(10, 11.5, 14, 11.5))], { anim: 'wiggle' }),
  ],
};
