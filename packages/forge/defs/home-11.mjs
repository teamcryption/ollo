import { R, C, D, poly } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'home',
  icons: [
    icon('sponge', 'Sponge', ['cleaning', 'scrub', 'dishes', 'wash', 'kitchen'], [body(R(4, 9, 16, 9.5, 2.5)), line('M4 12.5h16'), line(D(8, 15.5) + D(12, 15.5) + D(16, 15.5)), accent(C(17, 5, 1.5))]),
    icon('dustpan', 'Dustpan', ['sweep', 'cleaning', 'dust', 'housework', 'broom'], [body(R(10.5, 3.5, 3, 7.5, 1.5)), body(poly([[3.5, 20.5], [5.5, 11], [18.5, 11], [20.5, 20.5]], 1, true), { cover: true }), line('M7 17h10')], { noAccent: true }),
  ],
};
