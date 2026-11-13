import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'time',
  icons: [
    icon('calendar-2', 'Calendar Alt', ['date', 'schedule', 'event', 'month'], [body(R(3.5, 5, 17, 15.5, 3)), line('M8 3.5v3M16 3.5v3M3.7 10h16.6'), accent(L(7.5, 14.5, 10.5, 14.5))]),
    icon('calendar-3', 'Calendar Day', ['date', 'today', 'day', 'schedule'], [body(R(4, 4.5, 16, 16, 3)), line('M4.2 9h15.6'), line(L(12, 12.5, 12, 17)), accent(L(8, 6.8, 9.5, 6.8))]),
  ],
};
