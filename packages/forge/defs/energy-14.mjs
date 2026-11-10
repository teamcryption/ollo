import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'energy',
  icons: [
    icon('plug-pin', 'Charging Point', ['socket location', 'plug in', 'power outlet', 'energy', 'plug'], [line('M7 3.5v3M12 3.5v3'), body(R(5, 6.5, 9, 5, 1.5)), line('M9.5 11.5V14a2 2 0 0 0 2 2'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('plug-lock', 'Child Safe Socket', ['socket lock', 'safety', 'child proof', 'energy', 'plug'], [line('M7 3.5v3M12 3.5v3'), body(R(5, 6.5, 9, 5, 1.5)), line('M9.5 11.5V14a2 2 0 0 0 2 2'), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
  ],
};
