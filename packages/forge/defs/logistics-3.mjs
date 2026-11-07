import { R, C, L, A, poly, D, head } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'logistics',
  icons: [
    icon('crane', 'Crane', ['port crane', 'construction', 'lifting', 'cargo'], [line(L(7, 20.5, 7, 4)), line(L(4, 6, 20.5, 6)), body(R(3.5, 6.5, 3, 2.5, 0.5)), line(L(17, 6, 17, 12)), accent(R(15, 14, 4, 3, 0.6)), line(L(4, 20.5, 10, 20.5)), line(L(7, 4, 11, 6))]),
    icon('shipping-label', 'Shipping Label', ['label', 'address', 'parcel', 'barcode'], [body(R(4, 3.5, 16, 17, 2.5)), line(L(7, 7, 7, 11)), line(L(9, 7, 9, 11)), line(L(11.5, 7, 11.5, 11)), line(L(13, 7, 13, 11)), line(L(16, 7, 16, 11)), line(L(7, 14.5, 17, 14.5)), accent(L(7, 17.5, 12, 17.5))]),
    icon('this-side-up', 'This Side Up', ['handle with care', 'orientation', 'upright', 'packaging'], [line(L(8, 8, 8, 17)), line(head(8, 7.5, -90, 3.5)), line(L(16, 8, 16, 17)), line(head(16, 7.5, -90, 3.5)), accent(L(5, 20, 19, 20))]),
    icon('container-ship', 'Container Ship', ['cargo ship', 'freight', 'shipping', 'port'], [body('M3 14h18l-2.5 5.5h-13Z'), body(R(5.5, 9.5, 4, 4.5, 0.5)), body(R(10, 9.5, 4, 4.5, 0.5)), body(R(7.8, 5, 4, 4.5, 0.5)), line(L(17, 14, 17, 8))], { noAccent: true }),
  ],
};
