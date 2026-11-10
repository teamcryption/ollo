import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'home',
  icons: [
    icon('faucet-pencil', 'Edit Faucet', ['edit', 'write', 'modify', 'faucet', 'faucet'], [line('M7 7V4.5M5 4.5h4'), body('M3.5 7h7a4 4 0 0 1 4 4v1.5h-3V11a1 1 0 0 0-1-1h-7Z'), line(D(13, 15.5)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('broom-pencil', 'Edit Broom', ['edit', 'write', 'modify', 'broom', 'broom'], [line('M15 3.5 10 9.6'), body('M8.2 8.7l3.5 2.8-2.2 6-6-4.6Z'), line('M6 14.4l1.6-2M8.2 16l1.6-2'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('iron-pencil', 'Edit Iron', ['edit', 'write', 'modify', 'iron', 'iron'], [line('M8 9V6.5h6.5V9'), body('M3 15.5c0-3.6 2.5-6.5 6-6.5h5.5v6.5Z'), line(D(6.5, 12.5)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
