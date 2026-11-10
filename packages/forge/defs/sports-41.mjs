import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'sports',
  icons: [
    icon('trophy-chat', 'Trophy Chat', ['chat', 'support', 'message', 'trophy', 'trophy'], [body('M5.5 4h8v3.5a4 4 0 0 1-8 0Z'), line('M5.5 5.5H4a1.5 1.5 0 0 0 0 3h1.7M13.5 5.5H15a1.5 1.5 0 0 1 0 3h-1.7M9.5 11.5V15'), body(R(6.5, 15.5, 6, 2.5, 0.8)), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('dumbbell-chat', 'Dumbbell Chat', ['chat', 'support', 'message', 'dumbbell', 'dumbbell'], [body(R(3, 7.5, 2.4, 6, 0.8)), body(R(13.6, 7.5, 2.4, 6, 0.8)), line('M5.4 10.5h8.2'), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('soccer-chat', 'Soccer Chat', ['chat', 'support', 'message', 'soccer', 'soccer'], [body(C(9.5, 10, 6.5)), line(poly([[9.5, 7.6], [11.8, 9.3], [10.9, 12], [8.1, 12], [7.2, 9.3]], 0.3, true)), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('pool-chat', 'Pool Chat', ['chat', 'support', 'message', 'pool', 'pool'], [line('M6.5 3.5v8.5M11.5 3.5v8.5M6.5 6h5M6.5 9h5'), line('M3 14.5c1.2-1 2.3-1 3.5 0s2.3 1 3.5 0 2.3-1 3.5 0'), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('trophy-download', 'Download Trophy', ['download', 'save', 'export', 'trophy', 'trophy'], [body('M5.5 4h8v3.5a4 4 0 0 1-8 0Z'), line('M5.5 5.5H4a1.5 1.5 0 0 0 0 3h1.7M13.5 5.5H15a1.5 1.5 0 0 1 0 3h-1.7M9.5 11.5V15'), body(R(6.5, 15.5, 6, 2.5, 0.8)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('dumbbell-download', 'Download Dumbbell', ['download', 'save', 'export', 'dumbbell', 'dumbbell'], [body(R(3, 7.5, 2.4, 6, 0.8)), body(R(13.6, 7.5, 2.4, 6, 0.8)), line('M5.4 10.5h8.2'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('soccer-download', 'Download Soccer', ['download', 'save', 'export', 'soccer', 'soccer'], [body(C(9.5, 10, 6.5)), line(poly([[9.5, 7.6], [11.8, 9.3], [10.9, 12], [8.1, 12], [7.2, 9.3]], 0.3, true)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('pool-download', 'Download Pool', ['download', 'save', 'export', 'pool', 'pool'], [line('M6.5 3.5v8.5M11.5 3.5v8.5M6.5 6h5M6.5 9h5'), line('M3 14.5c1.2-1 2.3-1 3.5 0s2.3 1 3.5 0 2.3-1 3.5 0'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('pool-cloud', 'Cloud Pool', ['cloud', 'sync', 'online', 'pool', 'pool'], [line('M6.5 3.5v8.5M11.5 3.5v8.5M6.5 6h5M6.5 9h5'), line('M3 14.5c1.2-1 2.3-1 3.5 0s2.3 1 3.5 0 2.3-1 3.5 0'), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
    icon('trophy-pencil', 'Edit Trophy', ['edit', 'write', 'modify', 'trophy', 'trophy'], [body('M5.5 4h8v3.5a4 4 0 0 1-8 0Z'), line('M5.5 5.5H4a1.5 1.5 0 0 0 0 3h1.7M13.5 5.5H15a1.5 1.5 0 0 1 0 3h-1.7M9.5 11.5V15'), body(R(6.5, 15.5, 6, 2.5, 0.8)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('dumbbell-pencil', 'Edit Dumbbell', ['edit', 'write', 'modify', 'dumbbell', 'dumbbell'], [body(R(3, 7.5, 2.4, 6, 0.8)), body(R(13.6, 7.5, 2.4, 6, 0.8)), line('M5.4 10.5h8.2'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
