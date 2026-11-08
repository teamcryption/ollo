import { R, L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const RINGS = [line(L(8, 3, 8, 6)), line(L(16, 3, 16, 6))];
const CAL = R(3.5, 4.5, 17, 16, 3);
const HEADER = L(3.7, 9.5, 20.3, 9.5);

export default {
  category: 'time',
  icons: [
    icon('calendar-heart', 'Calendar Heart', ['date night', 'anniversary', 'valentine', 'love', 'event'], [...RINGS, body(CAL), line(HEADER), accent('M12 18.2l-2.9-2.8a1.8 1.8 0 0 1 2.9-2.2 1.8 1.8 0 0 1 2.9 2.2Z')]),
  ],
};
