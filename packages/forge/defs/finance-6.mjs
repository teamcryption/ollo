import { R, C, poly, star } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const bar = (x, y) => poly([[x, y + 4], [x + 1.2, y], [x + 6.8, y], [x + 8, y + 4]], 0.6, true);

export default {
  category: 'finance',
  icons: [
    icon('gold-bars', 'Gold Bars', ['gold', 'bullion', 'wealth', 'reserve', 'investment'], [body(bar(3.5, 16.5)), body(bar(12.5, 16.5)), body(bar(8, 11.5)), accent(star(17.5, 6.5, 2.6, 0.9, 4, 0.3, -90))]),
    icon('vault', 'Vault', ['safe', 'bank vault', 'secure', 'deposit', 'locker'], [line('M6 19v1.5M18 19v1.5'), body(R(3.5, 4, 17, 15, 2)), line(C(11, 11.5, 3.8)), line('M11 7.7v7.6M7.2 11.5h7.6M17.5 9v5')], { noAccent: true }),
  ],
};
