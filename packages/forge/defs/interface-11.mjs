import { icon, body, line } from '../src/dsl.mjs';
import { C } from '../src/geo.mjs';

export default {
  category: 'interface',
  icons: [
    icon('spinner', 'Spinner', ['loading', 'loader', 'busy', 'progress', 'wait'], [line('M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3M6 6l2.1 2.1M15.9 15.9 18 18M6 18l2.1-2.1M15.9 8.1 18 6')], { noAccent: true, anim: 'spin' }),
  ],
};
