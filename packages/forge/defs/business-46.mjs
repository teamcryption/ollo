import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'business',
  icons: [
    icon('megaphone-upload', 'Upload Megaphone', ['upload', 'send', 'export', 'megaphone', 'megaphone'], [body('M3 8.5h3l7.5-4v12L6 12.5H3Z'), line('M5 12.5l1 3.5'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('scale-upload', 'Upload Justice Scale', ['upload', 'send', 'export', 'justice scale', 'scale'], [line('M9.5 3.5v14M6 17.8h7M5 6h9'), line('M5 6.2l-2 4.2M5 6.2l2 4.2M14 6.2l-2 4.2M14 6.2l2 4.2'), body('M2.8 10.6h4.4a2.2 2.2 0 0 1-4.4 0Z'), body('M11.8 10.6h4.4a2.2 2.2 0 0 1-4.4 0Z'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('gavel-upload', 'Upload Gavel', ['upload', 'send', 'export', 'gavel', 'gavel'], [body(rotateD(R(7.5, 3, 7, 4, 1), 45, 11, 5)), line('M9.3 7.2 3.8 12.7'), body(R(3, 15.5, 8, 2.5, 0.8)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('id-badge-upload', 'Upload ID Badge', ['upload', 'send', 'export', 'id badge', 'id-badge'], [line('M8 3.5h3v2.5H8Z'), body(R(5, 5, 9, 13, 1.5)), line(C(9.5, 10, 1.6)), line('M7 15c.5-1.3 1.3-2 2.5-2s2 .7 2.5 2'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('filing-cabinet-upload', 'Upload Filing Cabinet', ['upload', 'send', 'export', 'filing cabinet', 'filing-cabinet'], [body(R(4.5, 3, 10, 15, 1.5)), line('M4.7 8h9.6M4.7 13h9.6'), line('M8 5.5h3M8 10.5h3M8 15.5h3'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('pin-board-upload', 'Upload Pin Board', ['upload', 'send', 'export', 'pin board', 'pin-board'], [body(R(3, 4, 13, 11, 1.2)), body(R(5, 6, 4, 3.5, 0.5)), line('M11 7h3M11 9.5h3M5.5 12h8'), line('M6.5 15.2 5.5 18M12.5 15.2l1 2.8'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('pencil-cup-upload', 'Upload Pencil Cup', ['upload', 'send', 'export', 'pencil cup', 'pencil-cup'], [line('M6.5 9 5.5 3.5M9.5 9V3M12.5 9l1-5.5'), body(poly([[4.5, 9], [14.5, 9], [13.5, 18], [5.5, 18]], 0.8, true)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('ballot-box-upload', 'Upload Ballot Box', ['upload', 'send', 'export', 'ballot box', 'ballot-box'], [body(R(3.5, 9, 12, 9, 1.2)), line('M6.5 12h6'), body(rotateD(R(7, 3.5, 5, 6, 0.6), 10, 9.5, 6.5)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
