import { C, E, L, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const grain = (x, y, a) => body(rotateD(E(x, y, 1.2, 2.2), a, x, y));

export default {
  category: 'food',
  icons: [
    icon('frying-pan', 'Frying Pan', ['pan', 'skillet', 'cooking', 'fry', 'kitchen'], [body(C(10, 12, 6.5)), line(L(16.7, 12, 21, 12)), accent(C(10, 12, 2))]),
    icon('wheat', 'Wheat', ['grain', 'gluten', 'harvest', 'farm', 'cereal'], [line(L(12, 7.5, 12, 20.5)), body(E(12, 5.2, 1.2, 2.2)), grain(10, 9, -35), grain(14, 9, 35), grain(10, 12.8, -35), grain(14, 12.8, 35), grain(10, 16.6, -35), grain(14, 16.6, 35)], { noAccent: true }),
  ],
};
