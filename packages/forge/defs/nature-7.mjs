import { E, L, R, poly } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'nature',
  icons: [
    icon('sprout', 'Sprout', ['seedling', 'grow', 'plant', 'new growth', 'garden'], [line(L(12, 20.5, 12, 11)), body('M12 13.5c-4 0-6.5-2.5-6.5-6 4 0 6.5 2.5 6.5 6Z'), body('M12 11c0-3.5 2.5-6 6.5-6 0 3.5-2.5 6-6.5 6Z'), line(L(7.5, 20.5, 16.5, 20.5))], { noAccent: true }),
    icon('tree-stump', 'Tree Stump', ['stump', 'wood', 'forest', 'logging', 'rings'], [line('M6 9.5V18l-2.5 2.5h17L18 18V9.5'), body(E(12, 9.5, 6, 2.5)), line(E(12, 9.5, 2.8, 1.1))], { noAccent: true }),
    icon('rock', 'Rock', ['boulder', 'stone', 'geology', 'mineral', 'terrain'], [body(poly([[4, 19.5], [5.5, 11.5], [10, 6.5], [15.5, 7.5], [19.5, 12], [20.5, 19.5]], 1.5, true)), line('M10.2 7.2l1.6 4.3-2 3')], { noAccent: true }),
    icon('bamboo', 'Bamboo', ['stalk', 'zen', 'asian', 'plant', 'grass'], [body(R(6.5, 3.5, 3, 17, 1.5)), body(R(13, 6, 3, 14.5, 1.5)), line('M6.5 9h3M6.5 14.5h3M13 10.5h3M13 15.5h3'), line('M16 9.5l3.5-2.5M9.5 6.5l3-2')], { noAccent: true }),
    icon('flood', 'Flood', ['flooding', 'water', 'disaster', 'storm surge', 'insurance'], [body(poly([[5, 11], [12, 4.5], [19, 11], [19, 16], [5, 16]], 0.8, true)), line('M3.5 17.5c1.4-1 2.8-1 4.2 0s2.8 1 4.2 0 2.8-1 4.2 0 2.8 1 4.2 0M3.5 20.5c1.4-1 2.8-1 4.2 0s2.8 1 4.2 0 2.8-1 4.2 0 2.8 1 4.2 0')], { noAccent: true }),
  ],
};
