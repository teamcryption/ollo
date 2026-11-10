import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'animals',
  icons: [
    icon('paw-chat', 'Pet Chat', ['chat', 'support', 'message', 'pet', 'paw'], [body(C(9.5, 12.5, 2.8)), body(C(5.5, 9, 1.3)), body(C(8.3, 6.2, 1.3)), body(C(11.7, 6.2, 1.3)), body(C(13.5, 9, 1.3)), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('fish-chat', 'Fish Chat', ['chat', 'support', 'message', 'fish', 'fish'], [body('M5 10.5c1.8-2.8 4.2-4.3 7-4.3 1.8 0 3.2 1.4 4 4.3-.8 2.9-2.2 4.3-4 4.3-2.8 0-5.2-1.5-7-4.3Z'), line('M5 10.5 3 8M5 10.5 3 13'), line(D(12.8, 9.6)), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('paw-download', 'Download Pet', ['download', 'save', 'export', 'pet', 'paw'], [body(C(9.5, 12.5, 2.8)), body(C(5.5, 9, 1.3)), body(C(8.3, 6.2, 1.3)), body(C(11.7, 6.2, 1.3)), body(C(13.5, 9, 1.3)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('fish-download', 'Download Fish', ['download', 'save', 'export', 'fish', 'fish'], [body('M5 10.5c1.8-2.8 4.2-4.3 7-4.3 1.8 0 3.2 1.4 4 4.3-.8 2.9-2.2 4.3-4 4.3-2.8 0-5.2-1.5-7-4.3Z'), line('M5 10.5 3 8M5 10.5 3 13'), line(D(12.8, 9.6)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('fish-cloud', 'Cloud Fish', ['cloud', 'sync', 'online', 'fish', 'fish'], [body('M5 10.5c1.8-2.8 4.2-4.3 7-4.3 1.8 0 3.2 1.4 4 4.3-.8 2.9-2.2 4.3-4 4.3-2.8 0-5.2-1.5-7-4.3Z'), line('M5 10.5 3 8M5 10.5 3 13'), line(D(12.8, 9.6)), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
    icon('paw-pencil', 'Edit Pet', ['edit', 'write', 'modify', 'pet', 'paw'], [body(C(9.5, 12.5, 2.8)), body(C(5.5, 9, 1.3)), body(C(8.3, 6.2, 1.3)), body(C(11.7, 6.2, 1.3)), body(C(13.5, 9, 1.3)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
