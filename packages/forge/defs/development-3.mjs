import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'development',
  icons: [
    icon('code-search', 'Code Search', ['search code', 'grep', 'find in files', 'inspect'], [line(poly([[7, 7], [3.5, 11], [7, 15]], 0.6)), body(C(14.5, 11, 4.5)), line(L(17.7, 14.2, 20.5, 17)), accent(poly([[13.6, 9.4], [15.4, 11], [13.6, 12.6]], 0.3))]),
  ],
};
