import { R, poly } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'home',
  icons: [
    icon('rug', 'Rug', ['carpet', 'mat', 'floor', 'decor', 'living room'], [line('M7.5 4.5V3M10.5 4.5V3M13.5 4.5V3M16.5 4.5V3M7.5 19.5V21M10.5 19.5V21M13.5 19.5V21M16.5 19.5V21'), body(R(5, 4.5, 14, 15, 1)), line(poly([[12, 7.5], [15.5, 12], [12, 16.5], [8.5, 12]], 0.5, true))], { noAccent: true }),
  ],
};
