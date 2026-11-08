import { R, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'transport',
  icons: [
    icon('train-front', 'Train Front', ['metro', 'subway', 'rail', 'commuter', 'locomotive'], [line('M8.5 17.5 6.5 20.5M15.5 17.5l2 3'), body(R(5.5, 3.5, 13, 14, 3.5)), line(R(7.5, 6, 9, 5, 1)), accent(D(8.5, 14.3) + D(15.5, 14.3))]),
  ],
};
