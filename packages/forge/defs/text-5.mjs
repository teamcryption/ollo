import { L } from '../src/geo.mjs';
import { icon, line, accent } from '../src/dsl.mjs';

export default {
  category: 'text',
  icons: [
    icon('text-rtl', 'Right to Left', ['rtl', 'text direction', 'arabic', 'hebrew', 'bidi'], [line(L(8, 5.5, 20, 5.5)), line(L(8, 9.5, 20, 9.5)), line(L(12, 13.5, 20, 13.5)), accent('M20.5 18.5H4.5M7 16l-2.5 2.5L7 21')]),
  ],
};
