import { C, L, poly } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'accessibility',
  icons: [
    icon('ramp', 'Accessible Ramp', ['ramp', 'step free', 'incline', 'wheelchair access', 'slope'], [body(poly([[3.5, 20.5], [20.5, 20.5], [20.5, 12]], 0.6, true)), accent('M6 14.5 13 11M10.5 10.2 13 11l-1 2.3')]),
    icon('screen-magnifier', 'Screen Magnifier', ['zoom text', 'magnify', 'low vision', 'enlarge', 'reading aid'], [line(C(10.5, 10.5, 6.5)), line(L(15.2, 15.2, 20, 20)), accent('M8 13l2.5-6 2.5 6M8.9 11h3.2')]),
  ],
};
