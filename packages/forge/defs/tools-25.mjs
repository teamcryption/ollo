import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'tools',
  icons: [
    icon('wrench-user', 'Wrench Account', ['user', 'account', 'profile', 'wrench', 'wrench'], [body('M13.5 3.5a3.5 3.5 0 0 0-3.3 4.6L4 14.3a1.4 1.4 0 0 0 2 2l6.2-6.2A3.5 3.5 0 0 0 16 7l-2 .5-1.5-1.5.5-2Z'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('toolbox-user', 'Toolbox Account', ['user', 'account', 'profile', 'toolbox', 'toolbox'], [line('M7 7V5.5h5V7'), body(R(3, 7, 13, 9, 1.5)), line('M3.2 11h12.6'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('brush-user', 'Paint Brush Account', ['user', 'account', 'profile', 'paint brush', 'brush'], [line('M15.5 3.5 10 9'), body('M8.8 9.4l1.8 1.8c0 2.6-2 4.6-5.6 4.6.6-1 .4-2.3 1.1-3.8.6-1.3 1.6-2.4 2.7-2.6Z'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('wrench-bell', 'Wrench Notification', ['notification', 'reminder', 'alert', 'wrench', 'wrench'], [body('M13.5 3.5a3.5 3.5 0 0 0-3.3 4.6L4 14.3a1.4 1.4 0 0 0 2 2l6.2-6.2A3.5 3.5 0 0 0 16 7l-2 .5-1.5-1.5.5-2Z'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('toolbox-bell', 'Toolbox Notification', ['notification', 'reminder', 'alert', 'toolbox', 'toolbox'], [line('M7 7V5.5h5V7'), body(R(3, 7, 13, 9, 1.5)), line('M3.2 11h12.6'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('brush-bell', 'Paint Brush Notification', ['notification', 'reminder', 'alert', 'paint brush', 'brush'], [line('M15.5 3.5 10 9'), body('M8.8 9.4l1.8 1.8c0 2.6-2 4.6-5.6 4.6.6-1 .4-2.3 1.1-3.8.6-1.3 1.6-2.4 2.7-2.6Z'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('wrench-cloud', 'Cloud Wrench', ['cloud', 'sync', 'online', 'wrench', 'wrench'], [body('M13.5 3.5a3.5 3.5 0 0 0-3.3 4.6L4 14.3a1.4 1.4 0 0 0 2 2l6.2-6.2A3.5 3.5 0 0 0 16 7l-2 .5-1.5-1.5.5-2Z'), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
  ],
};
