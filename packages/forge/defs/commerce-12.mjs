import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'commerce',
  icons: [
    icon('bag-shield', 'Buyer Protection', ['safe purchase', 'guarantee', 'protected order', 'shopping', 'bag'], [line('M7 7.5V6.5a2.5 2.5 0 0 1 5 0v1'), body('M4.5 8.8A1.3 1.3 0 0 1 5.8 7.5h7.4a1.3 1.3 0 0 1 1.3 1.3l.6 8.5a1.8 1.8 0 0 1-1.8 1.9H5.7a1.8 1.8 0 0 1-1.8-1.9Z'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('bag-pin', 'Pickup Point', ['collect order', 'click and collect', 'store pickup', 'shopping', 'bag'], [line('M7 7.5V6.5a2.5 2.5 0 0 1 5 0v1'), body('M4.5 8.8A1.3 1.3 0 0 1 5.8 7.5h7.4a1.3 1.3 0 0 1 1.3 1.3l.6 8.5a1.8 1.8 0 0 1-1.8 1.9H5.7a1.8 1.8 0 0 1-1.8-1.9Z'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('cart-lock', 'Secure Cart', ['secure checkout', 'locked basket', 'safe payment', 'shopping', 'cart'], [line('M3 4.5h1.8l1.8 8.5h6.2l1.2-5.5H5.6'), line(D(7, 16.5) + D(11.5, 16.5)), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
    icon('cart-pin', 'Pickup Location', ['collection point', 'delivery address', 'store', 'shopping', 'cart'], [line('M3 4.5h1.8l1.8 8.5h6.2l1.2-5.5H5.6'), line(D(7, 16.5) + D(11.5, 16.5)), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('store-lock', 'Store Closed', ['closed shop', 'after hours', 'locked store', 'retail', 'store'], [line('M3 9 4.5 4.5h10L16 9'), body(R(4, 9, 11, 10, 1.2)), line('M7.5 19v-4h3v4'), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
    icon('tag-lock', 'Price Lock', ['locked price', 'price guarantee', 'fixed rate', 'deal', 'tag'], [body('M3 4.5A1.5 1.5 0 0 1 4.5 3h4.8a1.5 1.5 0 0 1 1.1.4l5 5a1.5 1.5 0 0 1 0 2.2l-4.6 4.6a1.5 1.5 0 0 1-2.2 0l-5-5A1.5 1.5 0 0 1 3 9.1Z'), line(D(6.5, 6.5)), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
    icon('ticket-lock', 'Reserved Ticket', ['held seat', 'booking locked', 'reservation', 'event', 'ticket'], [body('M3 7.5A1.5 1.5 0 0 1 4.5 6h10A1.5 1.5 0 0 1 16 7.5V9a1.5 1.5 0 0 0 0 3v1.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 13.5V12a1.5 1.5 0 0 0 0-3Z'), line('M11 6.5v1.5M11 10v1M11 13v1.5'), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
  ],
};
