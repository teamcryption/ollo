import { R } from '../src/geo.mjs';
import { icon, body } from '../src/dsl.mjs';

export default {
  category: 'fashion',
  icons: [
    icon('bow-tie', 'Bow Tie', ['tuxedo', 'formal', 'dress code', 'gentleman', 'tie'], [body('M10.5 12 4 8v8Z'), body('M13.5 12 20 8v8Z'), body(R(10.5, 10.5, 3, 3, 1))], { noAccent: true }),
  ],
};
