import { C } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'people',
  icons: [
    icon('walking', 'Walking', ['walk', 'pedestrian', 'steps', 'stroll', 'commute on foot'], [body(C(13, 4.5, 1.8)), line('M12 8l-1.5 6'), line('M10.5 14 8 20.5M10.5 14l3 2.5 1 4'), line('M12 8.5l-3 3M12 8.5l2.5 3 2.5 1')], { noAccent: true, anim: { preset: 'nudge', dir: [1, 0], dist: 1 } }),
  ],
};
