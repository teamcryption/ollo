import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const CART = [line('M3.5 4.5h1.6a1.5 1.5 0 0 1 1.5 1.2L8 14.3a1.5 1.5 0 0 0 1.5 1.2h7.7a1.5 1.5 0 0 0 1.5-1.2l1.1-5.6a1.2 1.2 0 0 0-1.2-1.4H6.2'), body(C(9.5, 19.3, 1.3)), body(C(17, 19.3, 1.3))];
const BAG = 'M5.6 8.6A1.5 1.5 0 0 1 7.1 7.2h9.8a1.5 1.5 0 0 1 1.5 1.4l.8 10A2.2 2.2 0 0 1 17 21H7a2.2 2.2 0 0 1-2.2-2.4Z';

export default {
  category: 'commerce',
  icons: [
    icon('cart', 'Cart', ['shopping', 'basket', 'checkout', 'buy', 'store'], [...CART, accent(L(10.5, 11, 16, 11))], { anim: { preset: 'nudge', dir: [1, 0], dist: 1.5 }, badges: ['add', 'remove', 'check', 'close'] }),
    icon('bag', 'Shopping Bag', ['shopping', 'purchase', 'buy', 'store', 'tote'], [line('M9 9.5V7a3 3 0 0 1 6 0v2.5'), body(BAG), accent(L(10, 15.5, 14, 15.5))], { anim: { preset: 'bounce', dist: -1.5 }, badges: ['add', 'check'] }),
    icon('tag', 'Price Tag', ['price', 'label', 'sale', 'discount', 'offer'], [body('M3.5 5.5v5.2a2 2 0 0 0 .6 1.4l7.8 7.8a2 2 0 0 0 2.8 0l5.2-5.2a2 2 0 0 0 0-2.8L12.1 4.1a2 2 0 0 0-1.4-.6H5.5a2 2 0 0 0-2 2Z'), accent(C(8, 8, 1.3))], { anim: 'wiggle' }),
    icon('credit-card', 'Credit Card', ['payment', 'card', 'bank', 'debit', 'pay'], [body(R(3, 5.5, 18, 13, 2.5)), line(L(3.2, 9.5, 20.8, 9.5)), accent(L(6.5, 15, 10, 15))], { badges: ['add', 'check', 'close'] }),
    icon('wallet', 'Wallet', ['money', 'payment', 'purse', 'balance', 'funds'], [line('M5.5 6l9.3-2.6a1.5 1.5 0 0 1 1.9 1.4V6'), body(R(3.5, 6, 17, 13, 2.5)), accent(C(16.5, 12.5, 1))], { badges: ['add', 'check'] }),
    icon('receipt', 'Receipt', ['bill', 'invoice', 'purchase', 'transaction', 'order'], [body(poly([[6, 3.5], [18, 3.5], [18, 20.5], [16, 19], [14, 20.5], [12, 19], [10, 20.5], [8, 19], [6, 20.5]], 0.6, true)), line(L(9, 8, 15, 8)), accent(L(9, 11.5, 13, 11.5))]),
    icon('gift', 'Gift', ['present', 'reward', 'surprise', 'birthday', 'bonus'], [line('M12 7.5c-1-2.8-4.5-3.6-4.5-1.6 0 1.2 2 1.6 4.5 1.6'), line('M12 7.5c1-2.8 4.5-3.6 4.5-1.6 0 1.2-2 1.6-4.5 1.6'), body(R(3.5, 7.5, 17, 4, 1.5)), body(R(5, 13.5, 14, 7, 2)), accent(L(12, 15.5, 12, 18.5))], { anim: 'wiggle' }),
    icon('store', 'Store', ['shop', 'market', 'retail', 'storefront', 'business'], [body('M4 9.5 5.3 5a2 2 0 0 1 1.9-1.5h9.6a2 2 0 0 1 1.9 1.5L20 9.5a2.7 2.7 0 0 1-5.3 0 2.7 2.7 0 0 1-5.4 0 2.7 2.7 0 0 1-5.3 0Z'), line('M5.5 13v5.5a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V13'), accent('M10.5 17.5a1.5 1.5 0 0 1 3 0')]),
    icon('coins', 'Coins', ['money', 'cash', 'currency', 'savings', 'finance'], [body(C(9, 9.5, 5.5)), body(C(15, 14.5, 5.5), { cover: true }), accent(L(15, 12.2, 15, 16.8))], { anim: { preset: 'bounce', dist: -2 } }),
    icon('discount', 'Discount', ['percent', 'sale', 'offer', 'deal', 'promo'], [body(star(12, 12, 9, 7.6, 12, 0.8)), line(L(9.5, 14.5, 14.5, 9.5)), accent(D(9.6, 9.6)), line(D(14.4, 14.4))], { anim: 'spin' }),
    icon('package', 'Package', ['box', 'parcel', 'shipping', 'delivery', 'product'], [body('M12 3.5l7.5 4.2v8.6L12 20.5l-7.5-4.2V7.7Z'), line('M4.8 7.9 12 12l7.2-4.1'), line(L(12, 12, 12, 20.2)), line(L(8, 6, 15.5, 10.2))], { anim: { preset: 'bounce', dist: -2 }, noAccent: true }),
    icon('truck', 'Truck', ['delivery', 'shipping', 'transport', 'logistics', 'van'], [body(R(2.5, 5.5, 11, 10, 2)), body('M15.5 8.5h2.6a1.5 1.5 0 0 1 1.3.8l1.4 2.7a1.5 1.5 0 0 1 .2.7v1.8a1 1 0 0 1-1 1h-4.5Z'), body(C(7, 18.3, 1.8)), body(C(17, 18.3, 1.8)), accent(L(5.5, 9, 9, 9))], { anim: { preset: 'nudge', dir: [1, 0], dist: 1.5 } }),
    icon('barcode', 'Barcode', ['scan', 'product', 'sku', 'inventory', 'code'], [line('M4 8V6.5A2.5 2.5 0 0 1 6.5 4H8'), line('M16 4h1.5A2.5 2.5 0 0 1 20 6.5V8'), line('M20 16v1.5a2.5 2.5 0 0 1-2.5 2.5H16'), line('M8 20H6.5A2.5 2.5 0 0 1 4 17.5V16'), line(L(8, 9, 8, 15)), line(L(11, 9, 11, 15)), accent(L(13.5, 9, 13.5, 15)), line(L(16, 9, 16, 15))]),
  ],
};

function star(cx, cy, ro, ri, points, r) {
  const pts = [];
  for (let i = 0; i < points * 2; i++) {
    const a = ((-90 + (i * 180) / points) * Math.PI) / 180;
    const rr = i % 2 ? ri : ro;
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
  }
  return poly(pts, r, true);
}
