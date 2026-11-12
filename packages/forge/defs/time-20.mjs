import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'time',
  icons: [
    icon('calendar-crown', 'Premium Calendar', ['premium', 'pro', 'vip', 'calendar', 'calendar'], [body(R(3.5, 5, 12, 12.5, 2)), line('M3.7 9h11.6M7 3.5v3M12 3.5v3'), body(poly([[13, 20], [13, 14], [15.3, 16.3], [17, 13], [18.7, 16.3], [21, 14], [21, 20]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('stopwatch-crown', 'Premium Stopwatch', ['premium', 'pro', 'vip', 'stopwatch', 'stopwatch'], [body(C(9.5, 11.5, 6)), line('M8 3.5h3M9.5 3.6v2'), line('M9.5 11.5V8.5'), body(poly([[13, 20], [13, 14], [15.3, 16.3], [17, 13], [18.7, 16.3], [21, 14], [21, 20]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('alarm-clock-crown', 'Premium Alarm Clock', ['premium', 'pro', 'vip', 'alarm clock', 'alarm-clock'], [body(C(9.5, 11, 5.8)), line('M9.5 8v3.2l2 1.5'), line('M4 5.5 6 3.8M15 5.5 13 3.8'), body(poly([[13, 20], [13, 14], [15.3, 16.3], [17, 13], [18.7, 16.3], [21, 14], [21, 20]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('clock-history-crown', 'Premium Clock History', ['premium', 'pro', 'vip', 'clock history', 'clock-history'], [body(C(10, 10.5, 6)), line('M10 7.5v3l2 1.5'), line('M3.5 7.5 4 10.5l2.5-1.5'), body(poly([[13, 20], [13, 14], [15.3, 16.3], [17, 13], [18.7, 16.3], [21, 14], [21, 20]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('snooze-crown', 'Premium Snooze', ['premium', 'pro', 'vip', 'snooze', 'snooze'], [body(C(9.5, 11, 5.8)), line('M7.5 9h4l-4 4h4'), line('M4 5.5 6 3.8M15 5.5 13 3.8'), body(poly([[13, 20], [13, 14], [15.3, 16.3], [17, 13], [18.7, 16.3], [21, 14], [21, 20]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('calendar-moon', 'Calendar Night Mode', ['night', 'dark mode', 'sleep', 'calendar', 'calendar'], [body(R(3.5, 5, 12, 12.5, 2)), line('M3.7 9h11.6M7 3.5v3M12 3.5v3'), body('M20.5 18.7A4 4 0 0 1 16 12.6a4.2 4.2 0 1 0 4.5 6.1Z', { cover: true })], { noAccent: true }),
    icon('stopwatch-moon', 'Stopwatch Night Mode', ['night', 'dark mode', 'sleep', 'stopwatch', 'stopwatch'], [body(C(9.5, 11.5, 6)), line('M8 3.5h3M9.5 3.6v2'), line('M9.5 11.5V8.5'), body('M20.5 18.7A4 4 0 0 1 16 12.6a4.2 4.2 0 1 0 4.5 6.1Z', { cover: true })], { noAccent: true }),
    icon('alarm-clock-moon', 'Alarm Clock Night Mode', ['night', 'dark mode', 'sleep', 'alarm clock', 'alarm-clock'], [body(C(9.5, 11, 5.8)), line('M9.5 8v3.2l2 1.5'), line('M4 5.5 6 3.8M15 5.5 13 3.8'), body('M20.5 18.7A4 4 0 0 1 16 12.6a4.2 4.2 0 1 0 4.5 6.1Z', { cover: true })], { noAccent: true }),
  ],
};
