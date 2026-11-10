import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, poly, rotateD } from '../src/geo.mjs';

export default {
  category: 'weather',
  icons: [
    icon('drought', 'Drought', ['dry', 'heat', 'arid', 'cracked earth', 'climate'], [body(C(12, 7, 3.2)), line('M5.5 7H7M17 7h1.5M7.5 2.8l1 1M16.5 2.8l-1 1'), body(R(3.5, 13.5, 17, 7, 1.5)), line('M8 13.7l1.5 3-1 3.5M15 13.7l-1 3 1.5 3.5')], { noAccent: true }),
    icon('avalanche', 'Avalanche', ['snow slide', 'mountain', 'danger', 'snow', 'alpine'], [body(poly([[3.5, 20.5], [11, 7], [20.5, 20.5]], 1, true)), line('M8.5 11.5l2.5 1.5 2-1.5'), accent(C(16, 6, 1.5) + C(19, 9.5, 1))]),
  ],
};
