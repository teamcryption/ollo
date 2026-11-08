import { C, R, L } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'travel',
  icons: [
    icon('caravan', 'Caravan', ['trailer', 'camping', 'rv', 'holiday', 'tow'], [body('M5 7h10.5a4.5 4.5 0 0 1 4.5 4.5v5H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z'), line(R(5.5, 9.5, 4.5, 3, 0.8)), line('M12.5 16.5V9.5h3v7'), line(L(20, 15, 21, 15)), body(C(9, 17.5, 2.2), { cover: true })], { noAccent: true }),
  ],
};
