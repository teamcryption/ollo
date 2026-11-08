import { R } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'food',
  icons: [
    icon('mason-jar', 'Mason Jar', ['jar', 'preserve', 'pickle', 'canning', 'storage'], [body(R(6.5, 3.5, 11, 3, 1)), body('M7 6.5h10v1.5c1.5 1 2 2.5 2 4v6.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V12c0-1.5.5-3 2-4Z'), line('M5 13.5h14')], { noAccent: true }),
  ],
};
