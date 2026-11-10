import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D } from '../src/geo.mjs';

export default {
  category: 'finance',
  icons: [
    icon('coin-purse', 'Coin Purse', ['purse', 'change', 'coins', 'wallet', 'clasp'], [body(C(10.5, 5.5, 1.3) + C(13.5, 5.5, 1.3)), line('M5 9.2a7 3 0 0 1 14 0'), body(R(4, 9, 16, 11.5, 4))], { noAccent: true }),
    icon('loyalty-card', 'Loyalty Card', ['stamp card', 'rewards', 'punch card', 'points', 'membership'], [body(R(3, 5.5, 18, 13, 2)), line(C(7.5, 10.5, 1.5) + C(12, 10.5, 1.5) + C(16.5, 10.5, 1.5)), accent('M6.5 15h7')]),
    icon('sale-sign', 'Sale Sign', ['discount', 'offer', 'percent off', 'promotion', 'shop'], [line('M12 3.5 6 9M12 3.5 18 9'), body(R(3.5, 9, 17, 10, 2)), accent('M9.5 16.5l5-5' + D(9.8, 11.8) + D(14.2, 16.2))]),
    icon('ledger', 'Ledger', ['accounts', 'bookkeeping', 'records', 'journal', 'accounting'], [body(R(5, 3, 14, 18, 2)), line('M8.5 3.2v17.6M8.7 8h10.1M8.7 12h10.1M8.7 16h10.1')], { noAccent: true }),
  ],
};
