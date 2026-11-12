import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'commerce',
  icons: [
    icon('discount-pause', 'Pause Discount', ['pause', 'hold', 'stop', 'discount', 'discount'], [body(star(9.5, 10.5, 7, 5.8, 10, 0.6)), line('M7.3 13l4.4-5'), line(D(7.2, 8.3) + D(11.8, 12.7)), body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })], { noAccent: true }),
    icon('cart-leaf', 'Eco Cart', ['eco', 'green', 'sustainable', 'cart', 'cart'], [line('M3 4.5h1.8l1.8 8.5h6.2l1.2-5.5H5.6'), line(D(7, 16.5) + D(11.5, 16.5)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('gift-leaf', 'Eco Gift', ['eco', 'green', 'sustainable', 'gift', 'gift'], [body(R(3, 8, 13, 10, 1.5)), line('M9.5 8.2v9.6M3.2 11.5h12.6'), line('M9.5 8C8.5 5.5 6 4.5 5.5 6.3S8 8 9.5 8c1.5 0 4.5-.5 4-1.7S10.5 5.5 9.5 8'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('tag-leaf', 'Eco Tag', ['eco', 'green', 'sustainable', 'tag', 'tag'], [body('M3 4.5A1.5 1.5 0 0 1 4.5 3h4.8a1.5 1.5 0 0 1 1.1.4l5 5a1.5 1.5 0 0 1 0 2.2l-4.6 4.6a1.5 1.5 0 0 1-2.2 0l-5-5A1.5 1.5 0 0 1 3 9.1Z'), line(D(6.5, 6.5)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('diamond-leaf', 'Eco Diamond', ['eco', 'green', 'sustainable', 'diamond', 'diamond'], [body(poly([[6, 4.5], [13, 4.5], [16, 8.5], [9.5, 17], [3, 8.5]], 0.8, true)), line('M3.3 8.5h12.4'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('qr-code-leaf', 'Eco QR Code', ['eco', 'green', 'sustainable', 'qr code', 'qr-code'], [line(R(3.5, 3.5, 5, 5, 1) + R(10.5, 3.5, 5, 5, 1) + R(3.5, 10.5, 5, 5, 1)), line(D(6, 6) + D(13, 6) + D(6, 13) + D(11.5, 11.5)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
  ],
};
