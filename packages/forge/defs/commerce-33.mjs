import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'commerce',
  icons: [
    icon('bag-sparkle', 'AI Bag', ['ai', 'smart', 'magic', 'bag', 'bag'], [line('M7 7.5V6.5a2.5 2.5 0 0 1 5 0v1'), body('M4.5 8.8A1.3 1.3 0 0 1 5.8 7.5h7.4a1.3 1.3 0 0 1 1.3 1.3l.6 8.5a1.8 1.8 0 0 1-1.8 1.9H5.7a1.8 1.8 0 0 1-1.8-1.9Z'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('cart-sparkle', 'AI Cart', ['ai', 'smart', 'magic', 'cart', 'cart'], [line('M3 4.5h1.8l1.8 8.5h6.2l1.2-5.5H5.6'), line(D(7, 16.5) + D(11.5, 16.5)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('gift-sparkle', 'AI Gift', ['ai', 'smart', 'magic', 'gift', 'gift'], [body(R(3, 8, 13, 10, 1.5)), line('M9.5 8.2v9.6M3.2 11.5h12.6'), line('M9.5 8C8.5 5.5 6 4.5 5.5 6.3S8 8 9.5 8c1.5 0 4.5-.5 4-1.7S10.5 5.5 9.5 8'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('store-sparkle', 'AI Store', ['ai', 'smart', 'magic', 'store', 'store'], [line('M3 9 4.5 4.5h10L16 9'), body(R(4, 9, 11, 10, 1.2)), line('M7.5 19v-4h3v4'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('tag-sparkle', 'AI Tag', ['ai', 'smart', 'magic', 'tag', 'tag'], [body('M3 4.5A1.5 1.5 0 0 1 4.5 3h4.8a1.5 1.5 0 0 1 1.1.4l5 5a1.5 1.5 0 0 1 0 2.2l-4.6 4.6a1.5 1.5 0 0 1-2.2 0l-5-5A1.5 1.5 0 0 1 3 9.1Z'), line(D(6.5, 6.5)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('ticket-sparkle', 'AI Ticket', ['ai', 'smart', 'magic', 'ticket', 'ticket'], [body('M3 7.5A1.5 1.5 0 0 1 4.5 6h10A1.5 1.5 0 0 1 16 7.5V9a1.5 1.5 0 0 0 0 3v1.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 13.5V12a1.5 1.5 0 0 0 0-3Z'), line('M11 6.5v1.5M11 10v1M11 13v1.5'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('basket-sparkle', 'AI Basket', ['ai', 'smart', 'magic', 'basket', 'basket'], [line('M6.5 8.5 9.5 4l3 4.5'), body(poly([[3, 8.5], [16, 8.5], [14.5, 16.5], [4.5, 16.5]], 1, true)), line('M7.5 11v3M11.5 11v3'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('crown-sparkle', 'AI Crown', ['ai', 'smart', 'magic', 'crown', 'crown'], [body(poly([[3, 6], [6.5, 9.5], [9.5, 4.5], [12.5, 9.5], [16, 6], [15, 15], [4, 15]], 0.8, true)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('diamond-sparkle', 'AI Diamond', ['ai', 'smart', 'magic', 'diamond', 'diamond'], [body(poly([[6, 4.5], [13, 4.5], [16, 8.5], [9.5, 17], [3, 8.5]], 0.8, true)), line('M3.3 8.5h12.4'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('barcode-sparkle', 'AI Barcode', ['ai', 'smart', 'magic', 'barcode', 'barcode'], [line('M4 5v11M6.2 5v11M7.8 5v11M10.4 5v11M12.6 5v11M14.8 5v11'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('cash-register-sparkle', 'AI Cash Register', ['ai', 'smart', 'magic', 'cash register', 'cash-register'], [body(R(5, 3.5, 6, 4, 1)), line('M8 7.7V11'), body('M3.5 11h12v6a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1Z'), line(D(6, 13.3) + D(8.5, 13.3) + D(11, 13.3)), line('M3.7 15.5h11.6'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('qr-code-sparkle', 'AI QR Code', ['ai', 'smart', 'magic', 'qr code', 'qr-code'], [line(R(3.5, 3.5, 5, 5, 1) + R(10.5, 3.5, 5, 5, 1) + R(3.5, 10.5, 5, 5, 1)), line(D(6, 6) + D(13, 6) + D(6, 13) + D(11.5, 11.5)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('discount-sparkle', 'AI Discount', ['ai', 'smart', 'magic', 'discount', 'discount'], [body(star(9.5, 10.5, 7, 5.8, 10, 0.6)), line('M7.3 13l4.4-5'), line(D(7.2, 8.3) + D(11.8, 12.7)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('receipt-sparkle', 'AI Receipt', ['ai', 'smart', 'magic', 'receipt', 'receipt'], [body('M4.5 3.5h10v15l-2-1.3-1.7 1.3-1.3-1.3-1.7 1.3-1.6-1.3-1.7 1.3Z'), line('M7 7.5h5M7 10.5h5M7 13.5h3'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('percent-sparkle', 'AI Percentage', ['ai', 'smart', 'magic', 'percentage', 'percent'], [line('M4 17 15 4'), line(C(5.5, 6, 1.8)), line(C(13.5, 15, 1.8)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
  ],
};
