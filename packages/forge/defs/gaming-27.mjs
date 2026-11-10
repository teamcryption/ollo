import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'gaming',
  icons: [
    icon('gamepad-alert', 'Game Alert', ['alert', 'warning', 'problem', 'game', 'gamepad'], [body('M6 7h7a3 3 0 0 1 3 3v2.5a2.5 2.5 0 0 1-4.3 1.7L10.5 13h-2l-1.2 1.2A2.5 2.5 0 0 1 3 12.5V10a3 3 0 0 1 3-3Z'), line('M6.5 10h2M7.5 9v2'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
  ],
};
