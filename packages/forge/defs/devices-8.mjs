import { icon, body, line, accent } from '../src/dsl.mjs';
import { R } from '../src/geo.mjs';

export default {
  category: 'devices',
  icons: [
    icon('fitness-tracker', 'Fitness Tracker', ['activity band', 'wearable', 'steps', 'heart rate', 'band'], [line('M10 3.5v3.5M14 3.5v3.5M10 17v3.5M14 17v3.5'), body(R(7.5, 6.5, 9, 11, 4)), accent('M9.6 12h1.4l1-1.5 1 3 1-1.5h.4')]),
  ],
};
