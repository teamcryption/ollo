import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, star, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));


export default {
  category: 'energy',
  icons: [
    icon('utility-pole', 'Utility Pole', ['power pole', 'telephone pole', 'electricity', 'transformer', 'grid'], [line('M12 3.5v17M5 6.5h14M7 9.5h10'), line(D(6, 5) + D(18, 5) + D(8, 8) + D(16, 8)), body(R(13.5, 12, 4.5, 5, 1.5))], { noAccent: true }),
  ],
};
