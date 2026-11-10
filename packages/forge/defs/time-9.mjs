import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'time',
  icons: [
    icon('calendar-shield', 'Secure Calendar', ['private calendar', 'protected events', 'privacy', 'schedule', 'calendar'], [body(R(3, 5, 13.5, 12.5, 2.5)), line('M3.2 9h13.1M6.5 3.5v3M13 3.5v3'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('calendar-bolt', 'Quick Event', ['instant meeting', 'fast booking', 'express', 'schedule', 'calendar'], [body(R(3, 5, 13.5, 12.5, 2.5)), line('M3.2 9h13.1M6.5 3.5v3M13 3.5v3'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
