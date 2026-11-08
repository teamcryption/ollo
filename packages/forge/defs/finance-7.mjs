import { C } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';
import { PAGE, FOLD } from './files.mjs';

export default {
  category: 'finance',
  icons: [
    icon('tax', 'Tax', ['tax return', 'percent', 'invoice', 'vat', 'accounting'], [body(PAGE), line(FOLD), accent('M9.5 17.5l5-5' + C(10, 12.5, 0.9) + C(14, 17.5, 0.9))]),
  ],
};
