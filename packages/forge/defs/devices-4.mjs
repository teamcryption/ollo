import { R, L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'devices',
  icons: [
    icon('e-reader', 'E-Reader', ['ebook', 'kindle', 'reading device', 'digital book'], [body(R(5, 3, 14, 18, 2.5)), line(L(8, 7, 16, 7)), line(L(8, 10, 16, 10)), line(L(8, 13, 13, 13)), accent(L(10.5, 17.5, 13.5, 17.5))]),
  ],
};
