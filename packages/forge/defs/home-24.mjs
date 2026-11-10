import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'home',
  icons: [
    icon('peeler', 'Peeler', ['vegetable peeler', 'potato peeler', 'kitchen', 'prep', 'utensil'], [body(R(7, 4, 10, 3, 1.2)), line('M8.5 7 12 13M15.5 7 12 13'), body(R(10.8, 13, 2.4, 7.5, 1.2))], { noAccent: true }),
  ],
};
