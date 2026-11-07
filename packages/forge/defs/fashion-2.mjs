import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'fashion',
  icons: [
    icon('dress', 'Dress', ['gown', 'outfit', 'clothing', 'womenswear'], [body('M9 3.5h6l-1 4.5 4.5 12.5h-13L10 8Z'), line(L(9.8, 8, 14.2, 8))], { noAccent: true }),
    icon('trousers', 'Trousers', ['pants', 'jeans', 'clothing', 'legwear'], [body('M6 3.5h12l1 17h-5l-2-10-2 10H5Z'), line(L(6.1, 6.5, 17.9, 6.5))], { noAccent: true }),
    icon('ring', 'Ring', ['engagement', 'wedding', 'jewellery', 'proposal'], [line(C(12, 15, 5.5)), body(poly([[9.5, 7], [10.5, 5], [13.5, 5], [14.5, 7], [12, 9.5]], 0.4, true))], { noAccent: true }),
    icon('necktie', 'Tie', ['necktie', 'formal', 'business', 'suit'], [body(poly([[10, 3.5], [14, 3.5], [13.2, 6.5], [10.8, 6.5]], 0.4, true)), body(poly([[10.8, 7], [13.2, 7], [15, 17], [12, 20.5], [9, 17]], 0.6, true))], { noAccent: true }),
    icon('lipstick', 'Lipstick', ['makeup', 'beauty', 'cosmetics', 'lips'], [body('M9.5 12V6.5L14.5 4V12Z'), body(R(8.5, 12, 7, 8.5, 1)), line(L(8.7, 15, 15.3, 15))], { noAccent: true }),
    icon('sock', 'Sock', ['socks', 'clothing', 'footwear', 'laundry'], [body('M8 3.5h6v8l4 4a3 3 0 0 1-4 4.5L8.5 15A2 2 0 0 1 8 13.7Z'), line(L(8.2, 7, 13.8, 7))], { noAccent: true }),
  ],
};
