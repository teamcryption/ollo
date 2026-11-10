import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, star, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'sports',
  icons: [
    icon('gym-bag', 'Gym Bag', ['duffel bag', 'sports bag', 'workout', 'travel bag', 'holdall'], [line('M8.5 9V7a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2'), body(R(3.5, 9, 17, 10, 4)), line('M7 12.5h10')], { noAccent: true }),
  ],
};
