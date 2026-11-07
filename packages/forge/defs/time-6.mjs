import { R, L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'time',
  icons: [
    icon('calendar-note', 'Calendar Note', ['agenda', 'event details', 'appointment notes', 'schedule', 'memo'], [body(R(3.5, 5, 17, 15.5, 2.5)), line('M8 3.5v3M16 3.5v3'), line(L(3.7, 9.5, 20.3, 9.5)), line(L(7, 13, 17, 13)), accent(L(7, 16.5, 12, 16.5))]),
  ],
};
