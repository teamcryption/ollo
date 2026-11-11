import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'transport',
  icons: [
    icon('car-alert', 'Car Alert', ['alert', 'warning', 'problem', 'car', 'car'], [body('M3.5 12.5l1.6-4.3A1.5 1.5 0 0 1 6.5 7.2h6a1.5 1.5 0 0 1 1.4 1l1.6 4.3V16h-12Z'), line('M3.7 12.5h11.6'), line('M5 16v1.5M14 16v1.5'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('car-user', 'Car Account', ['user', 'account', 'profile', 'car', 'car'], [body('M3.5 12.5l1.6-4.3A1.5 1.5 0 0 1 6.5 7.2h6a1.5 1.5 0 0 1 1.4 1l1.6 4.3V16h-12Z'), line('M3.7 12.5h11.6'), line('M5 16v1.5M14 16v1.5'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('car-bell', 'Car Notification', ['notification', 'reminder', 'alert', 'car', 'car'], [body('M3.5 12.5l1.6-4.3A1.5 1.5 0 0 1 6.5 7.2h6a1.5 1.5 0 0 1 1.4 1l1.6 4.3V16h-12Z'), line('M3.7 12.5h11.6'), line('M5 16v1.5M14 16v1.5'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('car-cloud', 'Cloud Car', ['cloud', 'sync', 'online', 'car', 'car'], [body('M3.5 12.5l1.6-4.3A1.5 1.5 0 0 1 6.5 7.2h6a1.5 1.5 0 0 1 1.4 1l1.6 4.3V16h-12Z'), line('M3.7 12.5h11.6'), line('M5 16v1.5M14 16v1.5'), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
    icon('car-chat', 'Car Chat', ['chat', 'support', 'message', 'car', 'car'], [body('M3.5 12.5l1.6-4.3A1.5 1.5 0 0 1 6.5 7.2h6a1.5 1.5 0 0 1 1.4 1l1.6 4.3V16h-12Z'), line('M3.7 12.5h11.6'), line('M5 16v1.5M14 16v1.5'), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('car-download', 'Download Car', ['download', 'save', 'export', 'car', 'car'], [body('M3.5 12.5l1.6-4.3A1.5 1.5 0 0 1 6.5 7.2h6a1.5 1.5 0 0 1 1.4 1l1.6 4.3V16h-12Z'), line('M3.7 12.5h11.6'), line('M5 16v1.5M14 16v1.5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('car-pencil', 'Edit Car', ['edit', 'write', 'modify', 'car', 'car'], [body('M3.5 12.5l1.6-4.3A1.5 1.5 0 0 1 6.5 7.2h6a1.5 1.5 0 0 1 1.4 1l1.6 4.3V16h-12Z'), line('M3.7 12.5h11.6'), line('M5 16v1.5M14 16v1.5'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
