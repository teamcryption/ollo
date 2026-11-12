import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'time',
  icons: [
    icon('clock-history-fire', 'Trending Clock History', ['trending', 'hot', 'popular', 'clock history', 'clock-history'], [body(C(10, 10.5, 6)), line('M10 7.5v3l2 1.5'), line('M3.5 7.5 4 10.5l2.5-1.5'), body('M17 12c2 1.8 3.6 3.6 3.6 5.6a3.6 3.6 0 0 1-7.2 0c0-1.4.7-2.5 1.6-3.4.2 1 .7 1.7 1.4 1.9-.3-1.7.1-3 .6-4.1Z', { cover: true })], { noAccent: true }),
    icon('snooze-fire', 'Trending Snooze', ['trending', 'hot', 'popular', 'snooze', 'snooze'], [body(C(9.5, 11, 5.8)), line('M7.5 9h4l-4 4h4'), line('M4 5.5 6 3.8M15 5.5 13 3.8'), body('M17 12c2 1.8 3.6 3.6 3.6 5.6a3.6 3.6 0 0 1-7.2 0c0-1.4.7-2.5 1.6-3.4.2 1 .7 1.7 1.4 1.9-.3-1.7.1-3 .6-4.1Z', { cover: true })], { noAccent: true }),
    icon('clock-history-trophy', 'Clock History Award', ['award', 'winner', 'achievement', 'clock history', 'clock-history'], [body(C(10, 10.5, 6)), line('M10 7.5v3l2 1.5'), line('M3.5 7.5 4 10.5l2.5-1.5'), body('M14 12.8h6v2.7a3 3 0 0 1-6 0Z', { cover: true }), line('M17 18.5v1.7M15 20.6h4M14 13.8h-1v.6a1.6 1.6 0 0 0 1.4 1.6M20 13.8h1v.6a1.6 1.6 0 0 1-1.4 1.6')], { noAccent: true }),
    icon('snooze-trophy', 'Snooze Award', ['award', 'winner', 'achievement', 'snooze', 'snooze'], [body(C(9.5, 11, 5.8)), line('M7.5 9h4l-4 4h4'), line('M4 5.5 6 3.8M15 5.5 13 3.8'), body('M14 12.8h6v2.7a3 3 0 0 1-6 0Z', { cover: true }), line('M17 18.5v1.7M15 20.6h4M14 13.8h-1v.6a1.6 1.6 0 0 0 1.4 1.6M20 13.8h1v.6a1.6 1.6 0 0 1-1.4 1.6')], { noAccent: true }),
    icon('clock-history-moon', 'Clock History Night Mode', ['night', 'dark mode', 'sleep', 'clock history', 'clock-history'], [body(C(10, 10.5, 6)), line('M10 7.5v3l2 1.5'), line('M3.5 7.5 4 10.5l2.5-1.5'), body('M20.5 18.7A4 4 0 0 1 16 12.6a4.2 4.2 0 1 0 4.5 6.1Z', { cover: true })], { noAccent: true }),
    icon('snooze-moon', 'Snooze Night Mode', ['night', 'dark mode', 'sleep', 'snooze', 'snooze'], [body(C(9.5, 11, 5.8)), line('M7.5 9h4l-4 4h4'), line('M4 5.5 6 3.8M15 5.5 13 3.8'), body('M20.5 18.7A4 4 0 0 1 16 12.6a4.2 4.2 0 1 0 4.5 6.1Z', { cover: true })], { noAccent: true }),
  ],
};
