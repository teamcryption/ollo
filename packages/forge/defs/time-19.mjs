import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'time',
  icons: [
    icon('alarm-clock-question', 'Alarm Clock Help', ['help', 'question', 'support', 'alarm clock', 'alarm-clock'], [body(C(9.5, 11, 5.8)), line('M9.5 8v3.2l2 1.5'), line('M4 5.5 6 3.8M15 5.5 13 3.8'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.7 15.4a1.3 1.3 0 1 1 1.9 1.2c-.4.2-.6.5-.6.9'), line(D(17, 18.9))], { noAccent: true }),
    icon('clock-history-question', 'Clock History Help', ['help', 'question', 'support', 'clock history', 'clock-history'], [body(C(10, 10.5, 6)), line('M10 7.5v3l2 1.5'), line('M3.5 7.5 4 10.5l2.5-1.5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.7 15.4a1.3 1.3 0 1 1 1.9 1.2c-.4.2-.6.5-.6.9'), line(D(17, 18.9))], { noAccent: true }),
    icon('snooze-question', 'Snooze Help', ['help', 'question', 'support', 'snooze', 'snooze'], [body(C(9.5, 11, 5.8)), line('M7.5 9h4l-4 4h4'), line('M4 5.5 6 3.8M15 5.5 13 3.8'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.7 15.4a1.3 1.3 0 1 1 1.9 1.2c-.4.2-.6.5-.6.9'), line(D(17, 18.9))], { noAccent: true }),
    icon('clock-history-calendar', 'Clock History Booking', ['booking', 'date', 'appointment', 'clock history', 'clock-history'], [body(C(10, 10.5, 6)), line('M10 7.5v3l2 1.5'), line('M3.5 7.5 4 10.5l2.5-1.5'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('snooze-calendar', 'Snooze Booking', ['booking', 'date', 'appointment', 'snooze', 'snooze'], [body(C(9.5, 11, 5.8)), line('M7.5 9h4l-4 4h4'), line('M4 5.5 6 3.8M15 5.5 13 3.8'), body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')], { noAccent: true }),
    icon('clock-history-sparkle', 'AI Clock History', ['ai', 'smart', 'magic', 'clock history', 'clock-history'], [body(C(10, 10.5, 6)), line('M10 7.5v3l2 1.5'), line('M3.5 7.5 4 10.5l2.5-1.5'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('snooze-sparkle', 'AI Snooze', ['ai', 'smart', 'magic', 'snooze', 'snooze'], [body(C(9.5, 11, 5.8)), line('M7.5 9h4l-4 4h4'), line('M4 5.5 6 3.8M15 5.5 13 3.8'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('alarm-clock-trash', 'Delete Alarm Clock', ['delete', 'remove', 'trash', 'alarm clock', 'alarm-clock'], [body(C(9.5, 11, 5.8)), line('M9.5 8v3.2l2 1.5'), line('M4 5.5 6 3.8M15 5.5 13 3.8'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
  ],
};
