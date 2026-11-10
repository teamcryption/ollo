import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'people',
  icons: [
    icon('users-chat', 'Team Chat', ['chat', 'support', 'message', 'team', 'users'], [body(C(7, 8, 2.5)), line('M3 16c0-2.5 1.8-4 4-4s4 1.5 4 4M11.5 5a2.2 2.2 0 1 1 0 4.4M12.5 12c1.6.4 2.5 1.7 2.5 3.5'), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('user-chat', 'User Chat', ['chat', 'support', 'message', 'user', 'user'], [body(C(9.5, 8, 3.5)), body(translateD('M5.5 19c.4-2.7 3.1-4.5 6.5-4.5s6.1 1.8 6.5 4.5c.1.6-.4 1-.9 1H6.4c-.5 0-1-.4-.9-1Z', -2.5, 0)), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('baby-bottle-chat', 'Baby Bottle Chat', ['chat', 'support', 'message', 'baby bottle', 'baby-bottle'], [body('M8 3.5h3v2l1.5 2V16a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 16V7.5L8 5.5Z'), line('M6.7 10.5h5.6'), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('users-download', 'Download Team', ['download', 'save', 'export', 'team', 'users'], [body(C(7, 8, 2.5)), line('M3 16c0-2.5 1.8-4 4-4s4 1.5 4 4M11.5 5a2.2 2.2 0 1 1 0 4.4M12.5 12c1.6.4 2.5 1.7 2.5 3.5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('user-download', 'Download User', ['download', 'save', 'export', 'user', 'user'], [body(C(9.5, 8, 3.5)), body(translateD('M5.5 19c.4-2.7 3.1-4.5 6.5-4.5s6.1 1.8 6.5 4.5c.1.6-.4 1-.9 1H6.4c-.5 0-1-.4-.9-1Z', -2.5, 0)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('baby-bottle-download', 'Download Baby Bottle', ['download', 'save', 'export', 'baby bottle', 'baby-bottle'], [body('M8 3.5h3v2l1.5 2V16a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 16V7.5L8 5.5Z'), line('M6.7 10.5h5.6'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('baby-bottle-cloud', 'Cloud Baby Bottle', ['cloud', 'sync', 'online', 'baby bottle', 'baby-bottle'], [body('M8 3.5h3v2l1.5 2V16a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 16V7.5L8 5.5Z'), line('M6.7 10.5h5.6'), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
    icon('users-pencil', 'Edit Team', ['edit', 'write', 'modify', 'team', 'users'], [body(C(7, 8, 2.5)), line('M3 16c0-2.5 1.8-4 4-4s4 1.5 4 4M11.5 5a2.2 2.2 0 1 1 0 4.4M12.5 12c1.6.4 2.5 1.7 2.5 3.5'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
