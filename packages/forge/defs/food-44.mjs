import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'food',
  icons: [
    icon('coffee-user', 'Coffee Account', ['user', 'account', 'profile', 'coffee', 'coffee'], [body('M4 7.5h9V12a4.5 4.5 0 0 1-9 0Z'), line('M13 8.5h1a2 2 0 0 1 0 4h-1M7 3.5v2M10 3.5v2'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('pizza-user', 'Pizza Account', ['user', 'account', 'profile', 'pizza', 'pizza'], [body(poly([[3, 4.5], [16, 7.5], [6.5, 17]], 1, true)), line('M3.4 7.5 13.5 9.6'), line(D(7, 10.5) + D(9.5, 13) + D(10.5, 10.5)), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('restaurant-user', 'Restaurant Account', ['user', 'account', 'profile', 'restaurant', 'restaurant'], [line('M5 3.5v5a2 2 0 0 0 4 0v-5M7 3.5v14M13.5 3.5c-1.5 0-2.5 2-2.5 5h2.5v9'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('cake-user', 'Cake Account', ['user', 'account', 'profile', 'cake', 'cake'], [line('M9.5 9.5V6.5'), line(D(9.5, 4.8)), body(R(4, 10, 11, 7, 1.5)), line('M4.2 13c1.2 1 2.4 1 3.6 0s2.4-1 3.6 0 2.4 1 3.6 0'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('wine-user', 'Wine Account', ['user', 'account', 'profile', 'wine', 'wine'], [body('M8 3.5h3V7c1.5.8 2 2 2 3.5v6.5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-6.5c0-1.5.5-2.7 2-3.5Z'), line('M6.2 12h6.6'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('coffee-bell', 'Coffee Notification', ['notification', 'reminder', 'alert', 'coffee', 'coffee'], [body('M4 7.5h9V12a4.5 4.5 0 0 1-9 0Z'), line('M13 8.5h1a2 2 0 0 1 0 4h-1M7 3.5v2M10 3.5v2'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('pizza-bell', 'Pizza Notification', ['notification', 'reminder', 'alert', 'pizza', 'pizza'], [body(poly([[3, 4.5], [16, 7.5], [6.5, 17]], 1, true)), line('M3.4 7.5 13.5 9.6'), line(D(7, 10.5) + D(9.5, 13) + D(10.5, 10.5)), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('restaurant-bell', 'Restaurant Notification', ['notification', 'reminder', 'alert', 'restaurant', 'restaurant'], [line('M5 3.5v5a2 2 0 0 0 4 0v-5M7 3.5v14M13.5 3.5c-1.5 0-2.5 2-2.5 5h2.5v9'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('cake-bell', 'Cake Notification', ['notification', 'reminder', 'alert', 'cake', 'cake'], [line('M9.5 9.5V6.5'), line(D(9.5, 4.8)), body(R(4, 10, 11, 7, 1.5)), line('M4.2 13c1.2 1 2.4 1 3.6 0s2.4-1 3.6 0 2.4 1 3.6 0'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('wine-bell', 'Wine Notification', ['notification', 'reminder', 'alert', 'wine', 'wine'], [body('M8 3.5h3V7c1.5.8 2 2 2 3.5v6.5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-6.5c0-1.5.5-2.7 2-3.5Z'), line('M6.2 12h6.6'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('coffee-cloud', 'Cloud Coffee', ['cloud', 'sync', 'online', 'coffee', 'coffee'], [body('M4 7.5h9V12a4.5 4.5 0 0 1-9 0Z'), line('M13 8.5h1a2 2 0 0 1 0 4h-1M7 3.5v2M10 3.5v2'), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
    icon('pizza-cloud', 'Cloud Pizza', ['cloud', 'sync', 'online', 'pizza', 'pizza'], [body(poly([[3, 4.5], [16, 7.5], [6.5, 17]], 1, true)), line('M3.4 7.5 13.5 9.6'), line(D(7, 10.5) + D(9.5, 13) + D(10.5, 10.5)), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
    icon('restaurant-cloud', 'Cloud Restaurant', ['cloud', 'sync', 'online', 'restaurant', 'restaurant'], [line('M5 3.5v5a2 2 0 0 0 4 0v-5M7 3.5v14M13.5 3.5c-1.5 0-2.5 2-2.5 5h2.5v9'), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
    icon('cake-cloud', 'Cloud Cake', ['cloud', 'sync', 'online', 'cake', 'cake'], [line('M9.5 9.5V6.5'), line(D(9.5, 4.8)), body(R(4, 10, 11, 7, 1.5)), line('M4.2 13c1.2 1 2.4 1 3.6 0s2.4-1 3.6 0 2.4 1 3.6 0'), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
  ],
};
