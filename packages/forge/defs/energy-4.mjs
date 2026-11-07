import { R, C, L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'energy',
  icons: [
    icon('heat-pump', 'Heat Pump', ['hvac', 'outdoor unit', 'heating', 'cooling', 'efficient heating'], [body(R(3.5, 5.5, 17, 12.5, 2)), line(C(9, 11.75, 3.5)), accent(C(9, 11.75, 1)), line('M15 9.25h2.5M15 11.75h2.5M15 14.25h2.5'), line('M6 18v2M18 18v2')]),
  ],
};
