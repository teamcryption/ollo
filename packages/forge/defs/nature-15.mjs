import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, poly, rotateD } from '../src/geo.mjs';

export default {
  category: 'nature',
  icons: [
    icon('milk-can', 'Milk Can', ['churn', 'dairy', 'farm', 'milk', 'rustic'], [body(R(9, 3, 6, 2.5, 0.8)), body(poly([[10, 5.5], [14, 5.5], [14, 7.5], [17, 10], [17, 20.5], [7, 20.5], [7, 10], [10, 7.5]], 0.8, true)), line('M7 12.5H4.5M17 12.5h2.5M7.2 15.5h9.6')], { noAccent: true }),
  ],
};
