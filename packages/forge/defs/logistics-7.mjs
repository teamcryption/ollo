import { R, poly } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'logistics',
  icons: [
    icon('excavator', 'Excavator', ['digger', 'construction', 'earthmover', 'backhoe', 'site'], [line('M11.5 12 15.5 5.5l4.2 4.8'), body(poly([[18, 10.5], [21, 10.5], [20.3, 14.3], [17.3, 13.3]], 0.5, true)), body(R(4.5, 9.5, 7, 7, 1)), body(R(3, 16.5, 12.5, 4, 2), { cover: true })], { noAccent: true }),
  ],
};
