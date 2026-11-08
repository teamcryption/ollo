import { poly } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'maps',
  icons: [
    icon('treasure-map', 'Treasure Map', ['map', 'x marks the spot', 'pirate', 'adventure', 'quest'], [body(poly([[4, 6.5], [9, 4.5], [15, 6.5], [20, 4.5], [20, 17.5], [15, 19.5], [9, 17.5], [4, 19.5]], 0.8, true)), line('M7 16.5l1.2-.6M9.4 15.2l1-.9M11.3 13.3l.8-1'), accent('M15.5 8.5l2 2M17.5 8.5l-2 2')]),
  ],
};
