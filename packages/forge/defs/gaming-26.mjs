import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'gaming',
  icons: [
    icon('gamepad-shield', 'Game Protection', ['protected', 'secure', 'safety', 'game', 'gamepad'], [body('M6 7h7a3 3 0 0 1 3 3v2.5a2.5 2.5 0 0 1-4.3 1.7L10.5 13h-2l-1.2 1.2A2.5 2.5 0 0 1 3 12.5V10a3 3 0 0 1 3-3Z'), line('M6.5 10h2M7.5 9v2'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('gamepad-pin', 'Game Location', ['location', 'place', 'map', 'game', 'gamepad'], [body('M6 7h7a3 3 0 0 1 3 3v2.5a2.5 2.5 0 0 1-4.3 1.7L10.5 13h-2l-1.2 1.2A2.5 2.5 0 0 1 3 12.5V10a3 3 0 0 1 3-3Z'), line('M6.5 10h2M7.5 9v2'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('gamepad-bolt', 'Instant Game', ['quick', 'fast', 'instant', 'game', 'gamepad'], [body('M6 7h7a3 3 0 0 1 3 3v2.5a2.5 2.5 0 0 1-4.3 1.7L10.5 13h-2l-1.2 1.2A2.5 2.5 0 0 1 3 12.5V10a3 3 0 0 1 3-3Z'), line('M6.5 10h2M7.5 9v2'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
