import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'business',
  icons: [
    icon('id-badge-pencil', 'Edit ID Badge', ['edit', 'write', 'modify', 'id badge', 'id-badge'], [line('M8 3.5h3v2.5H8Z'), body(R(5, 5, 9, 13, 1.5)), line(C(9.5, 10, 1.6)), line('M7 15c.5-1.3 1.3-2 2.5-2s2 .7 2.5 2'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('filing-cabinet-pencil', 'Edit Filing Cabinet', ['edit', 'write', 'modify', 'filing cabinet', 'filing-cabinet'], [body(R(4.5, 3, 10, 15, 1.5)), line('M4.7 8h9.6M4.7 13h9.6'), line('M8 5.5h3M8 10.5h3M8 15.5h3'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('pin-board-pencil', 'Edit Pin Board', ['edit', 'write', 'modify', 'pin board', 'pin-board'], [body(R(3, 4, 13, 11, 1.2)), body(R(5, 6, 4, 3.5, 0.5)), line('M11 7h3M11 9.5h3M5.5 12h8'), line('M6.5 15.2 5.5 18M12.5 15.2l1 2.8'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
