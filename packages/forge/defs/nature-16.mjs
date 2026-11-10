import { icon, body, line } from '../src/dsl.mjs';
import { poly } from '../src/geo.mjs';

export default {
  category: 'nature',
  icons: [
    icon('iceberg', 'Iceberg', ['glacier', 'arctic', 'ice', 'polar', 'climate'], [body(poly([[4, 11.5], [8, 6], [10, 8], [13, 3.5], [17, 9], [20, 11.5]], 0.8, true)), line('M3 13.5h18'), line(poly([[6, 15.5], [18, 15.5], [15, 20.5], [9, 20.5]], 1, true))], { noAccent: true }),
  ],
};
