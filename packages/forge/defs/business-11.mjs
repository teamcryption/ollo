import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'business',
  icons: [
    icon('name-tag', 'Name Tag', ['hello sticker', 'badge', 'name badge', 'event', 'introduce'], [body(R(3.5, 5, 17, 14, 2.5)), line('M3.6 9.5h16.8'), accent('M7 15c1-1.5 2-1.5 2.5 0s1.5 1.5 2.5 0 1.5-1.5 2.5 0')]),
    icon('whiteboard', 'Whiteboard', ['dry erase', 'meeting', 'brainstorm', 'board', 'presentation'], [body(R(3.5, 3.5, 17, 11, 1.5)), line('M7 14.5v6M17 14.5v6'), accent('M7 9c1.5-2 3-2 4 0s2.5 2 4 0')]),
    icon('tape-dispenser', 'Tape Dispenser', ['sticky tape', 'office', 'stationery', 'desk', 'adhesive'], [body('M3.5 20v-5.5a6.5 6.5 0 0 1 13 0V16h4v4Z'), line(C(10, 14.5, 3)), line('M10 11.5h7.5l2.5 3')], { noAccent: true }),
  ],
};
