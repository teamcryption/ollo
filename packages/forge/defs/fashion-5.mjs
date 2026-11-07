import { R, C, L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'fashion',
  icons: [
    icon('boot', 'Boot', ['ankle boot', 'footwear', 'winter boot', 'shoe', 'hiking'], [body('M7.5 3.5h6.5v9l5 2.3a2 2 0 0 1 1.5 2v3.7h-13Z'), line(L(7.7, 17.5, 20.3, 17.5)), line('M10.5 7h3.5M10.5 10h3.5')], { noAccent: true }),
    icon('perfume', 'Perfume', ['fragrance', 'cologne', 'scent', 'beauty', 'spray bottle'], [body(R(9, 3.5, 6, 2.5, 1)), line('M10.5 6v3M13.5 6v3'), body(R(6, 9, 12, 11.5, 3)), accent(C(12, 14.75, 2))]),
  ],
};
