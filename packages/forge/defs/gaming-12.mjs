import { icon, body, line } from '../src/dsl.mjs';
import { R, poly } from '../src/geo.mjs';

export default {
  category: 'gaming',
  icons: [
    icon('rocking-horse', 'Rocking Horse', ['toy horse', 'rocker', 'nursery', 'kids', 'toy'], [line('M3.5 17c5 3.5 12 3.5 17 0'), line('M8 18.8l1-5M16 18.8l-1-5'), body(R(6.5, 10.5, 10, 3.5, 1.75)), body(poly([[14, 11], [15.5, 5], [18.5, 5.5], [19.5, 8.5], [17, 8.5], [16.5, 11]], 0.7, true)), line('M6.8 11.5 4.5 9.5')], { noAccent: true }),
  ],
};
