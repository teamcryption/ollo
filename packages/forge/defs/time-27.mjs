import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'time',
  icons: [
    icon('calendar-stats', 'Calendar Analytics', ['analytics', 'stats', 'report', 'calendar', 'calendar'], [body(R(3.5, 5, 12, 12.5, 2)), line('M3.7 9h11.6M7 3.5v3M12 3.5v3'), body(R(13.3, 16.8, 2.2, 3.7, 0.6), { cover: true }), body(R(15.9, 14.8, 2.2, 5.7, 0.6), { cover: true }), body(R(18.5, 12.5, 2.2, 8, 0.6), { cover: true })], { noAccent: true }),
    icon('stopwatch-stats', 'Stopwatch Analytics', ['analytics', 'stats', 'report', 'stopwatch', 'stopwatch'], [body(C(9.5, 11.5, 6)), line('M8 3.5h3M9.5 3.6v2'), line('M9.5 11.5V8.5'), body(R(13.3, 16.8, 2.2, 3.7, 0.6), { cover: true }), body(R(15.9, 14.8, 2.2, 5.7, 0.6), { cover: true }), body(R(18.5, 12.5, 2.2, 8, 0.6), { cover: true })], { noAccent: true }),
    icon('alarm-clock-stats', 'Alarm Clock Analytics', ['analytics', 'stats', 'report', 'alarm clock', 'alarm-clock'], [body(C(9.5, 11, 5.8)), line('M9.5 8v3.2l2 1.5'), line('M4 5.5 6 3.8M15 5.5 13 3.8'), body(R(13.3, 16.8, 2.2, 3.7, 0.6), { cover: true }), body(R(15.9, 14.8, 2.2, 5.7, 0.6), { cover: true }), body(R(18.5, 12.5, 2.2, 8, 0.6), { cover: true })], { noAccent: true }),
    icon('clock-history-stats', 'Clock History Analytics', ['analytics', 'stats', 'report', 'clock history', 'clock-history'], [body(C(10, 10.5, 6)), line('M10 7.5v3l2 1.5'), line('M3.5 7.5 4 10.5l2.5-1.5'), body(R(13.3, 16.8, 2.2, 3.7, 0.6), { cover: true }), body(R(15.9, 14.8, 2.2, 5.7, 0.6), { cover: true }), body(R(18.5, 12.5, 2.2, 8, 0.6), { cover: true })], { noAccent: true }),
    icon('snooze-stats', 'Snooze Analytics', ['analytics', 'stats', 'report', 'snooze', 'snooze'], [body(C(9.5, 11, 5.8)), line('M7.5 9h4l-4 4h4'), line('M4 5.5 6 3.8M15 5.5 13 3.8'), body(R(13.3, 16.8, 2.2, 3.7, 0.6), { cover: true }), body(R(15.9, 14.8, 2.2, 5.7, 0.6), { cover: true }), body(R(18.5, 12.5, 2.2, 8, 0.6), { cover: true })], { noAccent: true }),
  ],
};
