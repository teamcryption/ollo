import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'animals',
  icons: [
    icon('paw-user', 'Pet Account', ['user', 'account', 'profile', 'pet', 'paw'], [body(C(9.5, 12.5, 2.8)), body(C(5.5, 9, 1.3)), body(C(8.3, 6.2, 1.3)), body(C(11.7, 6.2, 1.3)), body(C(13.5, 9, 1.3)), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('fish-user', 'Fish Account', ['user', 'account', 'profile', 'fish', 'fish'], [body('M5 10.5c1.8-2.8 4.2-4.3 7-4.3 1.8 0 3.2 1.4 4 4.3-.8 2.9-2.2 4.3-4 4.3-2.8 0-5.2-1.5-7-4.3Z'), line('M5 10.5 3 8M5 10.5 3 13'), line(D(12.8, 9.6)), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('paw-bell', 'Pet Notification', ['notification', 'reminder', 'alert', 'pet', 'paw'], [body(C(9.5, 12.5, 2.8)), body(C(5.5, 9, 1.3)), body(C(8.3, 6.2, 1.3)), body(C(11.7, 6.2, 1.3)), body(C(13.5, 9, 1.3)), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('fish-bell', 'Fish Notification', ['notification', 'reminder', 'alert', 'fish', 'fish'], [body('M5 10.5c1.8-2.8 4.2-4.3 7-4.3 1.8 0 3.2 1.4 4 4.3-.8 2.9-2.2 4.3-4 4.3-2.8 0-5.2-1.5-7-4.3Z'), line('M5 10.5 3 8M5 10.5 3 13'), line(D(12.8, 9.6)), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('paw-cloud', 'Cloud Pet', ['cloud', 'sync', 'online', 'pet', 'paw'], [body(C(9.5, 12.5, 2.8)), body(C(5.5, 9, 1.3)), body(C(8.3, 6.2, 1.3)), body(C(11.7, 6.2, 1.3)), body(C(13.5, 9, 1.3)), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
  ],
};
