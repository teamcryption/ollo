import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'time',
  icons: [
    icon('calendar-camera', 'Calendar Photo', ['photo', 'camera', 'picture', 'calendar', 'calendar'], [body(R(3.5, 5, 12, 12.5, 2)), line('M3.7 9h11.6M7 3.5v3M12 3.5v3'), body('M13 15.2a1.2 1.2 0 0 1 1.2-1.2h1.2l.8-1.2h2.6l.8 1.2h1.2a1.2 1.2 0 0 1 1.2 1.2v4.1a1.2 1.2 0 0 1-1.2 1.2h-5.6a1.2 1.2 0 0 1-1.2-1.2Z', { cover: true }), line(C(17, 17.2, 1.4))], { noAccent: true }),
    icon('stopwatch-camera', 'Stopwatch Photo', ['photo', 'camera', 'picture', 'stopwatch', 'stopwatch'], [body(C(9.5, 11.5, 6)), line('M8 3.5h3M9.5 3.6v2'), line('M9.5 11.5V8.5'), body('M13 15.2a1.2 1.2 0 0 1 1.2-1.2h1.2l.8-1.2h2.6l.8 1.2h1.2a1.2 1.2 0 0 1 1.2 1.2v4.1a1.2 1.2 0 0 1-1.2 1.2h-5.6a1.2 1.2 0 0 1-1.2-1.2Z', { cover: true }), line(C(17, 17.2, 1.4))], { noAccent: true }),
    icon('alarm-clock-camera', 'Alarm Clock Photo', ['photo', 'camera', 'picture', 'alarm clock', 'alarm-clock'], [body(C(9.5, 11, 5.8)), line('M9.5 8v3.2l2 1.5'), line('M4 5.5 6 3.8M15 5.5 13 3.8'), body('M13 15.2a1.2 1.2 0 0 1 1.2-1.2h1.2l.8-1.2h2.6l.8 1.2h1.2a1.2 1.2 0 0 1 1.2 1.2v4.1a1.2 1.2 0 0 1-1.2 1.2h-5.6a1.2 1.2 0 0 1-1.2-1.2Z', { cover: true }), line(C(17, 17.2, 1.4))], { noAccent: true }),
    icon('clock-history-camera', 'Clock History Photo', ['photo', 'camera', 'picture', 'clock history', 'clock-history'], [body(C(10, 10.5, 6)), line('M10 7.5v3l2 1.5'), line('M3.5 7.5 4 10.5l2.5-1.5'), body('M13 15.2a1.2 1.2 0 0 1 1.2-1.2h1.2l.8-1.2h2.6l.8 1.2h1.2a1.2 1.2 0 0 1 1.2 1.2v4.1a1.2 1.2 0 0 1-1.2 1.2h-5.6a1.2 1.2 0 0 1-1.2-1.2Z', { cover: true }), line(C(17, 17.2, 1.4))], { noAccent: true }),
    icon('snooze-camera', 'Snooze Photo', ['photo', 'camera', 'picture', 'snooze', 'snooze'], [body(C(9.5, 11, 5.8)), line('M7.5 9h4l-4 4h4'), line('M4 5.5 6 3.8M15 5.5 13 3.8'), body('M13 15.2a1.2 1.2 0 0 1 1.2-1.2h1.2l.8-1.2h2.6l.8 1.2h1.2a1.2 1.2 0 0 1 1.2 1.2v4.1a1.2 1.2 0 0 1-1.2 1.2h-5.6a1.2 1.2 0 0 1-1.2-1.2Z', { cover: true }), line(C(17, 17.2, 1.4))], { noAccent: true }),
    icon('calendar-filter', 'Filter Calendar', ['filter', 'sort', 'refine', 'calendar', 'calendar'], [body(R(3.5, 5, 12, 12.5, 2)), line('M3.7 9h11.6M7 3.5v3M12 3.5v3'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('stopwatch-filter', 'Filter Stopwatch', ['filter', 'sort', 'refine', 'stopwatch', 'stopwatch'], [body(C(9.5, 11.5, 6)), line('M8 3.5h3M9.5 3.6v2'), line('M9.5 11.5V8.5'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('alarm-clock-filter', 'Filter Alarm Clock', ['filter', 'sort', 'refine', 'alarm clock', 'alarm-clock'], [body(C(9.5, 11, 5.8)), line('M9.5 8v3.2l2 1.5'), line('M4 5.5 6 3.8M15 5.5 13 3.8'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('clock-history-filter', 'Filter Clock History', ['filter', 'sort', 'refine', 'clock history', 'clock-history'], [body(C(10, 10.5, 6)), line('M10 7.5v3l2 1.5'), line('M3.5 7.5 4 10.5l2.5-1.5'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('snooze-filter', 'Filter Snooze', ['filter', 'sort', 'refine', 'snooze', 'snooze'], [body(C(9.5, 11, 5.8)), line('M7.5 9h4l-4 4h4'), line('M4 5.5 6 3.8M15 5.5 13 3.8'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
