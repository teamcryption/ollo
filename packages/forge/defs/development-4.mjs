import { C, L } from '../src/geo.mjs';
import { icon, line, accent } from '../src/dsl.mjs';

export default {
  category: 'development',
  icons: [
    icon('variable', 'Variable', ['var', 'parameter', 'x', 'formula', 'placeholder'], [line('M8 4.5c-2.5 2-3.5 4.5-3.5 7.5s1 5.5 3.5 7.5'), line('M16 4.5c2.5 2 3.5 4.5 3.5 7.5s-1 5.5-3.5 7.5'), accent('M9.5 9.5l5 5M14.5 9.5l-5 5')]),
    icon('breakpoint', 'Breakpoint', ['debug', 'pause execution', 'code line', 'stop point'], [line(L(10, 6, 19, 6)), line(L(10, 12, 17, 12)), line(L(10, 18, 19, 18)), accent(C(5.5, 12, 2))]),
  ],
};
