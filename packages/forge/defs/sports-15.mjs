import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, L } from '../src/geo.mjs';

export default {
  category: 'sports',
  icons: [
    icon('locker', 'Locker', ['lockers', 'changing room', 'gym', 'storage', 'school'], [body(R(4.5, 3, 7, 18, 1.5)), body(R(12.5, 3, 7, 18, 1.5)), line('M6.5 6h3M6.5 8h3M14.5 6h3M14.5 8h3'), line(L(17.5, 12, 17.5, 14)), accent(L(9.5, 12, 9.5, 14))]),
  ],
};
