import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'home',
  icons: [
    icon('fridge-user', 'Fridge Account', ['user', 'account', 'profile', 'fridge', 'fridge'], [body(R(5, 3.5, 9, 14, 1.5)), line('M5.2 8.5h8.6M7 5.5v1.5M7 10.5v2.5'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('washer-user', 'Washer Account', ['user', 'account', 'profile', 'washer', 'washer'], [body(R(4, 3.5, 11, 14, 1.5)), line('M4.2 6.5h10.6'), line(C(9.5, 11.5, 3)), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('oven-user', 'Oven Account', ['user', 'account', 'profile', 'oven', 'oven'], [body(R(4, 4, 11, 13, 1.5)), line(R(6, 8.5, 7, 6, 0.8)), line('M6.5 6.2h1M9 6.2h1'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('sofa-user', 'Sofa Account', ['user', 'account', 'profile', 'sofa', 'sofa'], [line('M5 9V7a1.5 1.5 0 0 1 1.5-1.5h6A1.5 1.5 0 0 1 14 7v2'), body(R(3, 9, 13, 6, 1.5)), line('M4.5 15v2M14.5 15v2'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('water-user', 'Water Account', ['user', 'account', 'profile', 'water', 'water'], [body('M9.5 3.5c2.5 3 4.5 5.5 4.5 8.3a4.5 4.5 0 0 1-9 0c0-2.8 2-5.3 4.5-8.3Z'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('lamp-user', 'Lamp Account', ['user', 'account', 'profile', 'lamp', 'lamp'], [body('M6 3.5h7l2 6H4Z'), line('M9.5 9.7V17M6 17.5h7'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('fridge-bell', 'Fridge Notification', ['notification', 'reminder', 'alert', 'fridge', 'fridge'], [body(R(5, 3.5, 9, 14, 1.5)), line('M5.2 8.5h8.6M7 5.5v1.5M7 10.5v2.5'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('washer-bell', 'Washer Notification', ['notification', 'reminder', 'alert', 'washer', 'washer'], [body(R(4, 3.5, 11, 14, 1.5)), line('M4.2 6.5h10.6'), line(C(9.5, 11.5, 3)), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('oven-bell', 'Oven Notification', ['notification', 'reminder', 'alert', 'oven', 'oven'], [body(R(4, 4, 11, 13, 1.5)), line(R(6, 8.5, 7, 6, 0.8)), line('M6.5 6.2h1M9 6.2h1'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('sofa-bell', 'Sofa Notification', ['notification', 'reminder', 'alert', 'sofa', 'sofa'], [line('M5 9V7a1.5 1.5 0 0 1 1.5-1.5h6A1.5 1.5 0 0 1 14 7v2'), body(R(3, 9, 13, 6, 1.5)), line('M4.5 15v2M14.5 15v2'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('water-bell', 'Water Notification', ['notification', 'reminder', 'alert', 'water', 'water'], [body('M9.5 3.5c2.5 3 4.5 5.5 4.5 8.3a4.5 4.5 0 0 1-9 0c0-2.8 2-5.3 4.5-8.3Z'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('lamp-bell', 'Lamp Notification', ['notification', 'reminder', 'alert', 'lamp', 'lamp'], [body('M6 3.5h7l2 6H4Z'), line('M9.5 9.7V17M6 17.5h7'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('fridge-cloud', 'Cloud Fridge', ['cloud', 'sync', 'online', 'fridge', 'fridge'], [body(R(5, 3.5, 9, 14, 1.5)), line('M5.2 8.5h8.6M7 5.5v1.5M7 10.5v2.5'), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
    icon('washer-cloud', 'Cloud Washer', ['cloud', 'sync', 'online', 'washer', 'washer'], [body(R(4, 3.5, 11, 14, 1.5)), line('M4.2 6.5h10.6'), line(C(9.5, 11.5, 3)), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
    icon('oven-cloud', 'Cloud Oven', ['cloud', 'sync', 'online', 'oven', 'oven'], [body(R(4, 4, 11, 13, 1.5)), line(R(6, 8.5, 7, 6, 0.8)), line('M6.5 6.2h1M9 6.2h1'), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
  ],
};
