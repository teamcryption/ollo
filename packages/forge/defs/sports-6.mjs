import { C } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'sports',
  icons: [
    icon('swimming', 'Swimming', ['swim', 'pool', 'freestyle', 'water sport', 'lap'], [body(C(16, 8, 1.8)), line('M4 13l4-3.5 3.5 3 3-1.5'), line('M3.5 16.5c1.4-1 2.8-1 4.2 0s2.8 1 4.2 0 2.8-1 4.2 0 2.8 1 4.2 0'), line('M3.5 20c1.4-1 2.8-1 4.2 0s2.8 1 4.2 0 2.8-1 4.2 0 2.8 1 4.2 0')], { noAccent: true }),
  ],
};
