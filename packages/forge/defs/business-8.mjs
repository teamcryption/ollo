import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, L, poly } from '../src/geo.mjs';

export default {
  category: 'business',
  icons: [
    icon('time-clock', 'Time Clock', ['punch clock', 'clock in', 'attendance', 'shift', 'timesheet'], [body(R(5, 3, 14, 18, 2)), line(C(12, 9, 3.5)), line('M9 16.5h6'), accent('M12 7.6V9l1.1.8')]),
  ],
};
