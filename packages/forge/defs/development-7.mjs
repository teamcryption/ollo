import { icon, body, line } from '../src/dsl.mjs';
import { R, D } from '../src/geo.mjs';

export default {
  category: 'development',
  icons: [
    icon('logic-gate', 'Logic Gate', ['and gate', 'boolean', 'circuit', 'digital logic', 'electronics'], [body('M6.5 5.5h5a6.5 6.5 0 0 1 0 13h-5Z'), line('M3 9h3.5M3 15h3.5M18 12h3')], { noAccent: true }),
    icon('breadboard', 'Breadboard', ['prototyping', 'electronics', 'circuit', 'maker', 'hardware'], [body(R(3.5, 5.5, 17, 13, 2)), line('M3.7 12h16.6'), line(D(7, 8.7) + D(10.3, 8.7) + D(13.7, 8.7) + D(17, 8.7) + D(7, 15.3) + D(10.3, 15.3) + D(13.7, 15.3) + D(17, 15.3))], { noAccent: true }),
  ],
};
