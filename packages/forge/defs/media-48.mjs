import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'media',
  icons: [
    icon('image-bolt', 'Instant Image', ['quick', 'fast', 'instant', 'image', 'image'], [body(R(3, 4.5, 13, 12, 2)), line('M3.5 14l3.5-3.5 3 3 2-2 3.5 3.5'), line(C(12, 8, 1.2)), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('image-alert', 'Image Alert', ['alert', 'warning', 'problem', 'image', 'image'], [body(R(3, 4.5, 13, 12, 2)), line('M3.5 14l3.5-3.5 3 3 2-2 3.5 3.5'), line(C(12, 8, 1.2)), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('image-user', 'Image Account', ['user', 'account', 'profile', 'image', 'image'], [body(R(3, 4.5, 13, 12, 2)), line('M3.5 14l3.5-3.5 3 3 2-2 3.5 3.5'), line(C(12, 8, 1.2)), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('image-bell', 'Image Notification', ['notification', 'reminder', 'alert', 'image', 'image'], [body(R(3, 4.5, 13, 12, 2)), line('M3.5 14l3.5-3.5 3 3 2-2 3.5 3.5'), line(C(12, 8, 1.2)), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('image-cloud', 'Cloud Image', ['cloud', 'sync', 'online', 'image', 'image'], [body(R(3, 4.5, 13, 12, 2)), line('M3.5 14l3.5-3.5 3 3 2-2 3.5 3.5'), line(C(12, 8, 1.2)), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
    icon('image-chat', 'Image Chat', ['chat', 'support', 'message', 'image', 'image'], [body(R(3, 4.5, 13, 12, 2)), line('M3.5 14l3.5-3.5 3 3 2-2 3.5 3.5'), line(C(12, 8, 1.2)), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('image-pencil', 'Edit Image', ['edit', 'write', 'modify', 'image', 'image'], [body(R(3, 4.5, 13, 12, 2)), line('M3.5 14l3.5-3.5 3 3 2-2 3.5 3.5'), line(C(12, 8, 1.2)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
