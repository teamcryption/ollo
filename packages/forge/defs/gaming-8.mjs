import { R, C, L, poly, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'gaming',
  icons: [
    icon('chess-queen', 'Chess Queen', ['chess', 'queen', 'strategy', 'board game', 'crown'], [line('M9 10.5 7.5 5.5l2.5 2.5L12 4l2 4 2.5-2.5-1.5 5'), body('M8.5 18c0-3 1-5 1.5-7.5h4c.5 2.5 1.5 4.5 1.5 7.5Z'), body(R(6, 18, 12, 2.5, 1))], { noAccent: true }),
    icon('dart', 'Dart', ['darts', 'throw', 'pub game', 'aim', 'bullseye'], [line(rotateD(L(12, 20.5, 12, 16.5), 45)), body(rotateD(R(10.8, 10.5, 2.4, 6, 1.2), 45)), line(rotateD(L(12, 7.5, 12, 10.5), 45)), body(rotateD(poly([[12, 3.5], [15, 6.5], [12, 8], [9, 6.5]], 0.5, true), 45))], { noAccent: true }),
  ],
};
