import { icon, body, accent } from '../src/dsl.mjs';
import { C, poly, star } from '../src/geo.mjs';

export default {
  category: 'celebration',
  icons: [
    icon('rosette', 'Rosette', ['ribbon award', 'prize', 'first place', 'winner', 'medal'], [body(poly([[9.2, 13.5], [11.5, 14.5], [9.5, 20.5], [8.3, 18.8], [6.8, 19.5]], 0.5, true)), body(poly([[14.8, 13.5], [12.5, 14.5], [14.5, 20.5], [15.7, 18.8], [17.2, 19.5]], 0.5, true)), body(star(12, 9, 6, 5.1, 14, 0.6, 0), { cover: true }), accent(C(12, 9, 2))]),
  ],
};
