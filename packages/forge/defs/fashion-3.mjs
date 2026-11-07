import { R } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'fashion',
  icons: [
    icon('handbag', 'Handbag', ['purse', 'bag', 'clutch', 'accessory', 'tote'], [line('M8.5 9V7a3.5 3.5 0 0 1 7 0v2'), body(R(4, 9, 16, 11.5, 2.5)), accent(R(10.5, 12.5, 3, 2.5, 0.8))]),
  ],
};
