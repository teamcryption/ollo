import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'sports',
  icons: [
    icon('trophy-user', 'Trophy Account', ['user', 'account', 'profile', 'trophy', 'trophy'], [body('M5.5 4h8v3.5a4 4 0 0 1-8 0Z'), line('M5.5 5.5H4a1.5 1.5 0 0 0 0 3h1.7M13.5 5.5H15a1.5 1.5 0 0 1 0 3h-1.7M9.5 11.5V15'), body(R(6.5, 15.5, 6, 2.5, 0.8)), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('dumbbell-user', 'Dumbbell Account', ['user', 'account', 'profile', 'dumbbell', 'dumbbell'], [body(R(3, 7.5, 2.4, 6, 0.8)), body(R(13.6, 7.5, 2.4, 6, 0.8)), line('M5.4 10.5h8.2'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('soccer-user', 'Soccer Account', ['user', 'account', 'profile', 'soccer', 'soccer'], [body(C(9.5, 10, 6.5)), line(poly([[9.5, 7.6], [11.8, 9.3], [10.9, 12], [8.1, 12], [7.2, 9.3]], 0.3, true)), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('pool-user', 'Pool Account', ['user', 'account', 'profile', 'pool', 'pool'], [line('M6.5 3.5v8.5M11.5 3.5v8.5M6.5 6h5M6.5 9h5'), line('M3 14.5c1.2-1 2.3-1 3.5 0s2.3 1 3.5 0 2.3-1 3.5 0'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('trophy-bell', 'Trophy Notification', ['notification', 'reminder', 'alert', 'trophy', 'trophy'], [body('M5.5 4h8v3.5a4 4 0 0 1-8 0Z'), line('M5.5 5.5H4a1.5 1.5 0 0 0 0 3h1.7M13.5 5.5H15a1.5 1.5 0 0 1 0 3h-1.7M9.5 11.5V15'), body(R(6.5, 15.5, 6, 2.5, 0.8)), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('dumbbell-bell', 'Dumbbell Notification', ['notification', 'reminder', 'alert', 'dumbbell', 'dumbbell'], [body(R(3, 7.5, 2.4, 6, 0.8)), body(R(13.6, 7.5, 2.4, 6, 0.8)), line('M5.4 10.5h8.2'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('soccer-bell', 'Soccer Notification', ['notification', 'reminder', 'alert', 'soccer', 'soccer'], [body(C(9.5, 10, 6.5)), line(poly([[9.5, 7.6], [11.8, 9.3], [10.9, 12], [8.1, 12], [7.2, 9.3]], 0.3, true)), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('pool-bell', 'Pool Notification', ['notification', 'reminder', 'alert', 'pool', 'pool'], [line('M6.5 3.5v8.5M11.5 3.5v8.5M6.5 6h5M6.5 9h5'), line('M3 14.5c1.2-1 2.3-1 3.5 0s2.3 1 3.5 0 2.3-1 3.5 0'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('trophy-cloud', 'Cloud Trophy', ['cloud', 'sync', 'online', 'trophy', 'trophy'], [body('M5.5 4h8v3.5a4 4 0 0 1-8 0Z'), line('M5.5 5.5H4a1.5 1.5 0 0 0 0 3h1.7M13.5 5.5H15a1.5 1.5 0 0 1 0 3h-1.7M9.5 11.5V15'), body(R(6.5, 15.5, 6, 2.5, 0.8)), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
    icon('dumbbell-cloud', 'Cloud Dumbbell', ['cloud', 'sync', 'online', 'dumbbell', 'dumbbell'], [body(R(3, 7.5, 2.4, 6, 0.8)), body(R(13.6, 7.5, 2.4, 6, 0.8)), line('M5.4 10.5h8.2'), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
    icon('soccer-cloud', 'Cloud Soccer', ['cloud', 'sync', 'online', 'soccer', 'soccer'], [body(C(9.5, 10, 6.5)), line(poly([[9.5, 7.6], [11.8, 9.3], [10.9, 12], [8.1, 12], [7.2, 9.3]], 0.3, true)), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
  ],
};
