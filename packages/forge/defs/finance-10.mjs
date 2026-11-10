import { icon, body, line } from '../src/dsl.mjs';
import { C, head } from '../src/geo.mjs';

export default {
  category: 'finance',
  icons: [
    icon('split-bill', 'Split Bill', ['split payment', 'share cost', 'go dutch', 'divide', 'receipt'], [body('M5.5 5a1.5 1.5 0 0 1 1.5-1.5h10A1.5 1.5 0 0 1 18.5 5v15.5l-2.2-1.5-2.1 1.5-2.2-1.5-2.2 1.5-2.1-1.5-2.2 1.5Z'), line('M12 6.5v1.6M12 10.7v1.6M12 14.9v1.6')], { noAccent: true }),
    icon('interest-rate', 'Interest Rate', ['rate rise', 'apr', 'percentage', 'yield', 'growth'], [line('M5 18.5 14 7'), body(C(6.3, 8.3, 2)), body(C(12.7, 17.2, 2)), line('M18.5 20.5v-9M16.5 13.5l2-2 2 2')], { noAccent: true }),
  ],
};
