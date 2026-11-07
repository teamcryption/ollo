import { R, C, L, poly, D, } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';
import { CORNERS } from './security.mjs';

export default {
  category: 'commerce',
  icons: [
    icon('basket', 'Basket', ['shopping', 'groceries', 'cart', 'buy', 'market'], [body(poly([[3.5, 10], [20.5, 10], [18.5, 19], [5.5, 19]], 1, true)), line(L(7.5, 10, 10, 4.5)), line(L(16.5, 10, 14, 4.5)), line(L(8.5, 13, 8.5, 16)), line(L(15.5, 13, 15.5, 16)), accent(L(12, 13, 12, 16))], { badges: ['add', 'check'] }),
    icon('cash-register', 'Cash Register', ['pos', 'checkout', 'till', 'sale', 'payment'], [body(R(4, 11, 16, 9.5, 2)), line('M7 11V5.5h10V11'), line(L(9, 8, 15, 8)), accent(L(10.5, 15.5, 13.5, 15.5))]),
    icon('scan-barcode', 'Scan Barcode', ['scan', 'barcode', 'checkout', 'product', 'sku'], [...CORNERS, line(L(8, 8, 8, 16)), line(L(10.5, 8, 10.5, 16)), line(L(14, 8, 14, 16)), accent(L(16.5, 8, 16.5, 16))]),
  ],
};
