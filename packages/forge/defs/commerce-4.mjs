import { R, L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'commerce',
  icons: [
    icon('product-return', 'Return Package', ['return', 'refund', 'send back', 'exchange', 'returns'], [body(R(9.5, 9, 11, 11.5, 1.5)), line('M13 9.2v3.5h4V9.2'), accent('M13 5H9a4 4 0 0 0-4 4v5M3.5 12.5 5 14l1.5-1.5')]),
    icon('gift-card', 'Gift Card', ['voucher', 'store credit', 'present card', 'gift voucher'], [body(R(3, 5.5, 18, 13, 2.5)), line(L(8, 5.7, 8, 18.3)), line(L(3.2, 12, 20.8, 12)), line('M8 12c-1-2-3-2.5-3-1s1.5 1 3 1c1.5 0 3 .5 3-1s-2-1-3 1'), accent('M13 15.5h4.5')]),
  ],
};
