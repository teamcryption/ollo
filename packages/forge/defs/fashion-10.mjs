import { R, L } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'fashion',
  icons: [
    icon('sewing-machine', 'Sewing Machine', ['sewing', 'stitch', 'tailor', 'craft', 'textile'], [line(L(10, 3.5, 10, 6.5)), body('M4.5 9a2.5 2.5 0 0 1 2.5-2.5h10a2.5 2.5 0 0 1 2.5 2.5v8.5h-5V11.5H7A2.5 2.5 0 0 1 4.5 9Z'), line(L(7, 11.5, 7, 15)), body(R(3, 17.5, 18, 3, 1.2))], { noAccent: true }),
  ],
};
