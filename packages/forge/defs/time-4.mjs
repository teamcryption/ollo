import { R, L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'time',
  icons: [
    icon('calendar-range', 'Date Range', ['range', 'period', 'booking', 'duration', 'from to'], [body(R(3.5, 5, 17, 15.5, 2.5)), line('M8 3.5v3M16 3.5v3'), line(L(3.7, 9.5, 20.3, 9.5)), accent(L(7.5, 14.5, 16.5, 14.5))]),
  ],
};
