import { R, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'transport',
  icons: [
    icon('submarine', 'Submarine', ['sub', 'underwater', 'navy', 'ocean', 'periscope'], [line('M12.5 7V4H15'), body(R(9, 7, 6, 4, 1)), body(R(3, 10.5, 16, 7.5, 3.75), { cover: true }), line('M20.5 12v4.5'), accent(D(8, 14.25) + D(12, 14.25))]),
  ],
};
