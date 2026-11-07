import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const BAG = 'M5.6 8.6A1.5 1.5 0 0 1 7.1 7.2h9.8a1.5 1.5 0 0 1 1.5 1.4l.8 10A2.2 2.2 0 0 1 17 21H7a2.2 2.2 0 0 1-2.2-2.4Z';

export default {
  category: 'commerce',
  icons: [
    icon('coupon', 'Coupon', ['voucher', 'promo code', 'discount', 'deal'], [body('M3.5 8A1.5 1.5 0 0 1 5 6.5h14A1.5 1.5 0 0 1 20.5 8v2a2 2 0 0 0 0 4v2a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 16v-2a2 2 0 0 0 0-4Z'), line(L(14, 9.5, 10, 14.5)), line(D(10, 10)), accent(D(14, 14))]),
    icon('pos-terminal', 'Card Terminal', ['card reader', 'payment terminal', 'pos', 'tap to pay'], [body(R(6, 3, 12, 18, 2.5)), line(R(8.5, 5.5, 7, 4.5, 1)), line(D(9.5, 13)), line(D(12, 13)), line(D(14.5, 13)), line(D(9.5, 16.5)), line(D(12, 16.5)), accent(D(14.5, 16.5))]),
    icon('bag-heart', 'Wishlist', ['wishlist', 'favourites', 'saved items', 'love'], [line('M9 7.2V6a3 3 0 0 1 6 0v1.2'), body(BAG), accent('M12 17.5l-2.4-2.4a1.6 1.6 0 0 1 2.4-2.1 1.6 1.6 0 0 1 2.4 2.1Z')]),
    icon('shopping-list', 'Shopping List', ['grocery list', 'checklist', 'to buy', 'list'], [body(R(5, 3.5, 14, 17, 2.5)), line(poly([[8, 8.5], [9, 9.5], [10.5, 7.8]], 0.2)), line(L(12.5, 8.7, 16, 8.7)), line(poly([[8, 13], [9, 14], [10.5, 12.3]], 0.2)), line(L(12.5, 13.2, 16, 13.2)), line(D(9.2, 17)), accent(L(12.5, 17, 16, 17))]),
  ],
};
