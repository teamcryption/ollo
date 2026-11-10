import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'transport',
  icons: [
    icon('ship-clock', 'Sailing Times', ['ferry schedule', 'departures', 'cruise', 'boat', 'ship'], [line('M9.5 12V4.5l4.5 5.5H9.5'), body('M3 12h13l-1.8 4.2H4.8Z'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('ship-pin', 'Port', ['harbour', 'dock location', 'marina', 'boat', 'ship'], [line('M9.5 12V4.5l4.5 5.5H9.5'), body('M3 12h13l-1.8 4.2H4.8Z'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
  ],
};
