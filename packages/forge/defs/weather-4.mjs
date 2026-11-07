import { C, L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'weather',
  icons: [
    icon('humidity', 'Humidity', ['moisture', 'damp', 'dew point', 'water vapour', 'humid'], [body('M12 3.5s6 6.3 6 10.5a6 6 0 0 1-12 0C6 9.8 12 3.5 12 3.5Z'), accent([L(9.8, 16.6, 14.2, 12), C(10.1, 12.1, 0.7), C(13.9, 16.5, 0.7)].join(''))]),
    icon('heat-wave', 'Heat Wave', ['hot', 'heat', 'summer', 'scorching', 'high temperature'], [body(C(12, 8.5, 3.2)), line('M5.5 8.5H7M17 8.5h1.5M12 3v.8M7.4 4l.9.9M16.6 4l-.9.9'), accent('M4 16c1.3-1 2.7-1 4 0s2.7 1 4 0 2.7-1 4 0 2.7 1 4 0'), line('M4 19.5c1.3-1 2.7-1 4 0s2.7 1 4 0 2.7-1 4 0 2.7 1 4 0')], { anim: 'pulse' }),
  ],
};
