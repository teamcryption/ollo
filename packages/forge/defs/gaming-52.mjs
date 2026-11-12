import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'gaming',
  icons: [
    icon('handheld-console-pause', 'Pause Handheld Console', ['pause', 'hold', 'stop', 'handheld console', 'handheld-console'], [body(R(4.5, 3, 10, 15, 2)), line(R(6.3, 5, 6.4, 5, 0.6)), line('M7 13.5h2M8 12.5v2'), line(D(11.5, 13) + D(12.5, 14.5)), body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })], { noAccent: true }),
    icon('pawn-leaf', 'Eco Chess', ['eco', 'green', 'sustainable', 'chess', 'pawn'], [line(C(9.5, 5.5, 2)), body('M7.5 9h4l-.8 1.5c0 2 .8 3.5 2.3 5h-7c1.5-1.5 2.3-3 2.3-5Z'), line('M4.5 18h10'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('domino-leaf', 'Eco Domino', ['eco', 'green', 'sustainable', 'domino', 'domino'], [body(R(5.5, 3, 8, 15.5, 2)), line('M5.7 10.75h7.6'), line(D(8, 5.8) + D(9.5, 7.3) + D(11, 8.8) + D(8, 13.5) + D(11, 13.5)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('sword-leaf', 'Eco Sword', ['eco', 'green', 'sustainable', 'sword', 'sword'], [body(rotateD('M8.6 2.8h1.8l.4 9.7H8.2Z', 45, 9.5, 10.5)), line(rotateD('M6.3 12.9h6.4', 45, 9.5, 10.5)), line(rotateD('M9.5 13.2v3.6', 45, 9.5, 10.5)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('bomb-leaf', 'Eco Bomb', ['eco', 'green', 'sustainable', 'bomb', 'bomb'], [line('M12.3 8.2c.5-1.5 1.5-2.5 3-3'), body(C(8.5, 12.3, 5.5)), line('M6 10.2a3 3 0 0 1 2-2'), line('M16 3v1.2M17.3 4.5h-1.2'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('teddy-leaf', 'Eco Teddy Bear', ['eco', 'green', 'sustainable', 'teddy bear', 'teddy'], [body(C(5.5, 5, 1.8)), body(C(13.5, 5, 1.8)), body(C(9.5, 10, 5)), line(E(9.5, 12, 2, 1.5)), line(D(7.5, 8.8) + D(11.5, 8.8)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('spinning-top-leaf', 'Eco Spinning Top', ['eco', 'green', 'sustainable', 'spinning top', 'spinning-top'], [line('M9.5 5.5V3'), body('M4 9a5.5 3.5 0 0 1 11 0Z'), body('M3.5 10.2h12l-6 7.8Z'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('rook-leaf', 'Eco Rook', ['eco', 'green', 'sustainable', 'rook', 'rook'], [body(poly([[5, 4], [7, 4], [7, 5.5], [8.5, 5.5], [8.5, 4], [10.5, 4], [10.5, 5.5], [12, 5.5], [12, 4], [14, 4], [14, 8], [12.5, 9], [13, 14.5], [6, 14.5], [6.5, 9], [5, 8]], 0.4, true)), body(R(4, 15.5, 11, 2.5, 0.8)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
  ],
};
