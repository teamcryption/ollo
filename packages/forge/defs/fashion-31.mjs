import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'fashion',
  icons: [
    icon('ring-search', 'Search Ring', ['search', 'find', 'lookup', 'ring', 'ring'], [line(C(9.5, 12.5, 5)), body(poly([[7.5, 3.5], [11.5, 3.5], [12.8, 5.3], [9.5, 7.6], [6.2, 5.3]], 0.6, true)), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('ring-clock', 'Ring Schedule', ['schedule', 'time', 'history', 'ring', 'ring'], [line(C(9.5, 12.5, 5)), body(poly([[7.5, 3.5], [11.5, 3.5], [12.8, 5.3], [9.5, 7.6], [6.2, 5.3]], 0.6, true)), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('ring-shield', 'Ring Protection', ['protected', 'secure', 'safety', 'ring', 'ring'], [line(C(9.5, 12.5, 5)), body(poly([[7.5, 3.5], [11.5, 3.5], [12.8, 5.3], [9.5, 7.6], [6.2, 5.3]], 0.6, true)), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('ring-gear', 'Ring Settings', ['settings', 'configure', 'preferences', 'ring', 'ring'], [line(C(9.5, 12.5, 5)), body(poly([[7.5, 3.5], [11.5, 3.5], [12.8, 5.3], [9.5, 7.6], [6.2, 5.3]], 0.6, true)), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('ring-pin', 'Ring Location', ['location', 'place', 'map', 'ring', 'ring'], [line(C(9.5, 12.5, 5)), body(poly([[7.5, 3.5], [11.5, 3.5], [12.8, 5.3], [9.5, 7.6], [6.2, 5.3]], 0.6, true)), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('ring-bolt', 'Instant Ring', ['quick', 'fast', 'instant', 'ring', 'ring'], [line(C(9.5, 12.5, 5)), body(poly([[7.5, 3.5], [11.5, 3.5], [12.8, 5.3], [9.5, 7.6], [6.2, 5.3]], 0.6, true)), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('ring-heart', 'Favourite Ring', ['favourite', 'saved', 'like', 'ring', 'ring'], [line(C(9.5, 12.5, 5)), body(poly([[7.5, 3.5], [11.5, 3.5], [12.8, 5.3], [9.5, 7.6], [6.2, 5.3]], 0.6, true)), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('ring-star', 'Featured Ring', ['featured', 'top rated', 'best', 'ring', 'ring'], [line(C(9.5, 12.5, 5)), body(poly([[7.5, 3.5], [11.5, 3.5], [12.8, 5.3], [9.5, 7.6], [6.2, 5.3]], 0.6, true)), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('ring-alert', 'Ring Alert', ['alert', 'warning', 'problem', 'ring', 'ring'], [line(C(9.5, 12.5, 5)), body(poly([[7.5, 3.5], [11.5, 3.5], [12.8, 5.3], [9.5, 7.6], [6.2, 5.3]], 0.6, true)), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('ring-user', 'Ring Account', ['user', 'account', 'profile', 'ring', 'ring'], [line(C(9.5, 12.5, 5)), body(poly([[7.5, 3.5], [11.5, 3.5], [12.8, 5.3], [9.5, 7.6], [6.2, 5.3]], 0.6, true)), body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })], { noAccent: true }),
    icon('ring-bell', 'Ring Notification', ['notification', 'reminder', 'alert', 'ring', 'ring'], [line(C(9.5, 12.5, 5)), body(poly([[7.5, 3.5], [11.5, 3.5], [12.8, 5.3], [9.5, 7.6], [6.2, 5.3]], 0.6, true)), body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')], { noAccent: true }),
    icon('ring-cloud', 'Cloud Ring', ['cloud', 'sync', 'online', 'ring', 'ring'], [line(C(9.5, 12.5, 5)), body(poly([[7.5, 3.5], [11.5, 3.5], [12.8, 5.3], [9.5, 7.6], [6.2, 5.3]], 0.6, true)), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
    icon('ring-chat', 'Ring Chat', ['chat', 'support', 'message', 'ring', 'ring'], [line(C(9.5, 12.5, 5)), body(poly([[7.5, 3.5], [11.5, 3.5], [12.8, 5.3], [9.5, 7.6], [6.2, 5.3]], 0.6, true)), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('ring-download', 'Download Ring', ['download', 'save', 'export', 'ring', 'ring'], [line(C(9.5, 12.5, 5)), body(poly([[7.5, 3.5], [11.5, 3.5], [12.8, 5.3], [9.5, 7.6], [6.2, 5.3]], 0.6, true)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
  ],
};
