import { C, arcArrow } from '../src/geo.mjs';
import { icon, line, accent } from '../src/dsl.mjs';

export default {
  category: 'commerce',
  icons: [
    icon('cashback', 'Cashback', ['refund', 'money back', 'rebate', 'reward', 'return money'], [...arcArrow(12, 12, 8, 120, 420, 3).map((d) => line(d)), accent(C(12, 12, 3))]),
  ],
};
