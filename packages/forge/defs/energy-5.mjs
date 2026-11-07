import { R, C } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'energy',
  icons: [
    icon('power-strip', 'Power Strip', ['extension lead', 'multi plug', 'sockets', 'surge protector', 'outlets'], [body(R(3.5, 8.5, 17, 7, 2)), line(C(7, 12, 1.2)), line(C(11.5, 12, 1.2)), accent(R(15, 10.5, 3, 3, 0.8))]),
  ],
};
