import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'gaming',
  icons: [
    icon('slot-machine', 'Slot Machine', ['casino', 'jackpot', 'gambling', 'one armed bandit', 'fruit machine'], [body(R(3.5, 6, 13, 14.5, 2)), line(R(6, 9, 8, 5, 1)), line('M8.7 9.2v4.6M11.3 9.2v4.6M7 17.5h6'), line('M16.5 13h3V7.5'), line(C(19.5, 5, 1.3))], { noAccent: true }),
  ],
};
