import { C, L } from '../src/geo.mjs';
import { icon, line } from '../src/dsl.mjs';

export default {
  category: 'maps',
  icons: [
    icon('anchor', 'Anchor', ['harbour', 'port', 'marina', 'nautical', 'dock'], [line(C(12, 5.3, 1.8)), line(L(12, 7.1, 12, 20.5)), line(L(9, 10.5, 15, 10.5)), line('M4.5 13.5a7.5 7.5 0 0 0 15 0'), line('M3.5 15.5l1-2 2 1M20.5 15.5l-1-2-2 1')], { noAccent: true }),
  ],
};
