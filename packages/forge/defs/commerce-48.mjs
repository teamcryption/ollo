import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'commerce',
  icons: [
    icon('cart-bulb', 'Cart Ideas', ['idea', 'tip', 'insight', 'cart', 'cart'], [line('M3 4.5h1.8l1.8 8.5h6.2l1.2-5.5H5.6'), line(D(7, 16.5) + D(11.5, 16.5)), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('barcode-bulb', 'Barcode Ideas', ['idea', 'tip', 'insight', 'barcode', 'barcode'], [line('M4 5v11M6.2 5v11M7.8 5v11M10.4 5v11M12.6 5v11M14.8 5v11'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('cash-register-bulb', 'Cash Register Ideas', ['idea', 'tip', 'insight', 'cash register', 'cash-register'], [body(R(5, 3.5, 6, 4, 1)), line('M8 7.7V11'), body('M3.5 11h12v6a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1Z'), line(D(6, 13.3) + D(8.5, 13.3) + D(11, 13.3)), line('M3.7 15.5h11.6'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('percent-bulb', 'Percentage Ideas', ['idea', 'tip', 'insight', 'percentage', 'percent'], [line('M4 17 15 4'), line(C(5.5, 6, 1.8)), line(C(13.5, 15, 1.8)), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('basket-full-bulb', 'Basket Full Ideas', ['idea', 'tip', 'insight', 'basket full', 'basket-full'], [line('M3 8.5h13M6 8.5 8.5 3.5M13 8.5 10.5 3.5'), body('M3.5 9h12l-1.3 7.7a1.5 1.5 0 0 1-1.5 1.3H6.3a1.5 1.5 0 0 1-1.5-1.3Z'), line('M7 11.5v3.5M9.5 11.5v3.5M12 11.5v3.5'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('receipt-long-filter', 'Filter Receipt Long', ['filter', 'sort', 'refine', 'receipt long', 'receipt-long'], [body('M5 3h9v15l-1.5-1-1.5 1-1.5-1-1.5 1-1.5-1L5 18Z'), line('M7.5 6.5h4M7.5 9h4M7.5 11.5h2.5'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('price-up-filter', 'Filter Price Up', ['filter', 'sort', 'refine', 'price up', 'price-up'], [body('M3 4.5A1.5 1.5 0 0 1 4.5 3h4.8a1.5 1.5 0 0 1 1.1.4l5 5a1.5 1.5 0 0 1 0 2.2l-4.6 4.6a1.5 1.5 0 0 1-2.2 0l-5-5A1.5 1.5 0 0 1 3 9.1Z'), line('M7.5 12l3-3M8.5 9h2v2'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('vending-machine-filter', 'Filter Vending Machine', ['filter', 'sort', 'refine', 'vending machine', 'vending-machine'], [body(R(4, 3, 11, 15, 1.5)), line(R(5.8, 5, 5, 8, 0.5)), line('M13 6v1M13 9v1'), line('M6 15.5h5'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('basket-full-filter', 'Filter Basket Full', ['filter', 'sort', 'refine', 'basket full', 'basket-full'], [line('M3 8.5h13M6 8.5 8.5 3.5M13 8.5 10.5 3.5'), body('M3.5 9h12l-1.3 7.7a1.5 1.5 0 0 1-1.5 1.3H6.3a1.5 1.5 0 0 1-1.5-1.3Z'), line('M7 11.5v3.5M9.5 11.5v3.5M12 11.5v3.5'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('marketplace-filter', 'Filter Marketplace', ['filter', 'sort', 'refine', 'marketplace', 'marketplace'], [body(poly([[3, 8], [4.5, 4], [14.5, 4], [16, 8]], 0.5, true)), line('M3 8c0 1.5 1 2 2.2 2s2.2-.5 2.2-2c0 1.5 1 2 2.1 2s2.1-.5 2.1-2c0 1.5 1 2 2.2 2S16 9.5 16 8'), line('M4.5 10.5V18h10v-7.5'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('loyalty-card-filter', 'Filter Loyalty Card', ['filter', 'sort', 'refine', 'loyalty card', 'loyalty-card'], [body(R(3, 5, 13, 11, 1.5)), body(star(9.5, 10.5, 3, 1.3, 5, 0.3)), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
