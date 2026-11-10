import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'communication',
  icons: [
    icon('message-user', 'Message Account', ['user', 'account', 'profile', 'message', 'message'], [body('M5.5 4h9A2.5 2.5 0 0 1 17 6.5v4a2.5 2.5 0 0 1-2.5 2.5H9l-3.5 3v-3A2.5 2.5 0 0 1 3 10.5v-4A2.5 2.5 0 0 1 5.5 4Z'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('phone-user', 'Phone Account', ['user', 'account', 'profile', 'phone', 'phone'], [body('M5.5 3.5h2.5l1.3 3.2-1.8 1.3a8 8 0 0 0 3.5 3.5l1.3-1.8 3.2 1.3v2.5A1.5 1.5 0 0 1 14 15c-6 0-10-4-10-10a1.5 1.5 0 0 1 1.5-1.5Z'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('inbox-user', 'Inbox Account', ['user', 'account', 'profile', 'inbox', 'inbox'], [body('M3 11.5 5 5.5h9l2 6v4a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 15.5Z'), line('M3.2 11.5h3.3l1 1.5h4l1-1.5h3.3'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('newspaper-user', 'Newspaper Account', ['user', 'account', 'profile', 'newspaper', 'newspaper'], [body(R(3, 4, 12.5, 13, 1.5)), line(R(5.5, 6.5, 4, 3.5, 0.5)), line('M11.5 7h1.5M11.5 9.5h1.5M5.5 12.5h7.5M5.5 15h5'), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('message-bell', 'Message Notification', ['notification', 'reminder', 'alert', 'message', 'message'], [body('M5.5 4h9A2.5 2.5 0 0 1 17 6.5v4a2.5 2.5 0 0 1-2.5 2.5H9l-3.5 3v-3A2.5 2.5 0 0 1 3 10.5v-4A2.5 2.5 0 0 1 5.5 4Z'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('phone-bell', 'Phone Notification', ['notification', 'reminder', 'alert', 'phone', 'phone'], [body('M5.5 3.5h2.5l1.3 3.2-1.8 1.3a8 8 0 0 0 3.5 3.5l1.3-1.8 3.2 1.3v2.5A1.5 1.5 0 0 1 14 15c-6 0-10-4-10-10a1.5 1.5 0 0 1 1.5-1.5Z'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('inbox-bell', 'Inbox Notification', ['notification', 'reminder', 'alert', 'inbox', 'inbox'], [body('M3 11.5 5 5.5h9l2 6v4a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 15.5Z'), line('M3.2 11.5h3.3l1 1.5h4l1-1.5h3.3'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('newspaper-bell', 'Newspaper Notification', ['notification', 'reminder', 'alert', 'newspaper', 'newspaper'], [body(R(3, 4, 12.5, 13, 1.5)), line(R(5.5, 6.5, 4, 3.5, 0.5)), line('M11.5 7h1.5M11.5 9.5h1.5M5.5 12.5h7.5M5.5 15h5'), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('message-cloud', 'Cloud Message', ['cloud', 'sync', 'online', 'message', 'message'], [body('M5.5 4h9A2.5 2.5 0 0 1 17 6.5v4a2.5 2.5 0 0 1-2.5 2.5H9l-3.5 3v-3A2.5 2.5 0 0 1 3 10.5v-4A2.5 2.5 0 0 1 5.5 4Z'), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
    icon('phone-cloud', 'Cloud Phone', ['cloud', 'sync', 'online', 'phone', 'phone'], [body('M5.5 3.5h2.5l1.3 3.2-1.8 1.3a8 8 0 0 0 3.5 3.5l1.3-1.8 3.2 1.3v2.5A1.5 1.5 0 0 1 14 15c-6 0-10-4-10-10a1.5 1.5 0 0 1 1.5-1.5Z'), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
    icon('inbox-cloud', 'Cloud Inbox', ['cloud', 'sync', 'online', 'inbox', 'inbox'], [body('M3 11.5 5 5.5h9l2 6v4a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 15.5Z'), line('M3.2 11.5h3.3l1 1.5h4l1-1.5h3.3'), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
    icon('newspaper-cloud', 'Cloud Newspaper', ['cloud', 'sync', 'online', 'newspaper', 'newspaper'], [body(R(3, 4, 12.5, 13, 1.5)), line(R(5.5, 6.5, 4, 3.5, 0.5)), line('M11.5 7h1.5M11.5 9.5h1.5M5.5 12.5h7.5M5.5 15h5'), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
  ],
};
