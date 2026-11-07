import { L, poly } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'sports',
  icons: [
    icon('kite', 'Kite', ['kite flying', 'wind', 'beach', 'play', 'outdoors'], [body(poly([[12, 3.5], [17, 8.5], [12, 15], [7, 8.5]], 0.6, true)), line(L(12, 3.8, 12, 14.7)), line(L(7.3, 8.5, 16.7, 8.5)), line('M12 15c-1.2 1.2.8 2 0 3.2s.8 1.6 0 2.3')], { noAccent: true, anim: 'wiggle' }),
  ],
};
