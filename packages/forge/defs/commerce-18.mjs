import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'commerce',
  icons: [
    icon('crown-heart', 'Favourite Crown', ['favourite', 'saved', 'like', 'crown', 'crown'], [body(poly([[3, 6], [6.5, 9.5], [9.5, 4.5], [12.5, 9.5], [16, 6], [15, 15], [4, 15]], 0.8, true)), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('crown-star', 'Featured Crown', ['featured', 'top rated', 'best', 'crown', 'crown'], [body(poly([[3, 6], [6.5, 9.5], [9.5, 4.5], [12.5, 9.5], [16, 6], [15, 15], [4, 15]], 0.8, true)), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('bag-alert', 'Bag Alert', ['alert', 'warning', 'problem', 'bag', 'bag'], [line('M7 7.5V6.5a2.5 2.5 0 0 1 5 0v1'), body('M4.5 8.8A1.3 1.3 0 0 1 5.8 7.5h7.4a1.3 1.3 0 0 1 1.3 1.3l.6 8.5a1.8 1.8 0 0 1-1.8 1.9H5.7a1.8 1.8 0 0 1-1.8-1.9Z'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('cart-alert', 'Cart Alert', ['alert', 'warning', 'problem', 'cart', 'cart'], [line('M3 4.5h1.8l1.8 8.5h6.2l1.2-5.5H5.6'), line(D(7, 16.5) + D(11.5, 16.5)), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('store-alert', 'Store Alert', ['alert', 'warning', 'problem', 'store', 'store'], [line('M3 9 4.5 4.5h10L16 9'), body(R(4, 9, 11, 10, 1.2)), line('M7.5 19v-4h3v4'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('tag-alert', 'Tag Alert', ['alert', 'warning', 'problem', 'tag', 'tag'], [body('M3 4.5A1.5 1.5 0 0 1 4.5 3h4.8a1.5 1.5 0 0 1 1.1.4l5 5a1.5 1.5 0 0 1 0 2.2l-4.6 4.6a1.5 1.5 0 0 1-2.2 0l-5-5A1.5 1.5 0 0 1 3 9.1Z'), line(D(6.5, 6.5)), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('ticket-alert', 'Ticket Alert', ['alert', 'warning', 'problem', 'ticket', 'ticket'], [body('M3 7.5A1.5 1.5 0 0 1 4.5 6h10A1.5 1.5 0 0 1 16 7.5V9a1.5 1.5 0 0 0 0 3v1.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 13.5V12a1.5 1.5 0 0 0 0-3Z'), line('M11 6.5v1.5M11 10v1M11 13v1.5'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('basket-alert', 'Basket Alert', ['alert', 'warning', 'problem', 'basket', 'basket'], [line('M6.5 8.5 9.5 4l3 4.5'), body(poly([[3, 8.5], [16, 8.5], [14.5, 16.5], [4.5, 16.5]], 1, true)), line('M7.5 11v3M11.5 11v3'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('crown-alert', 'Crown Alert', ['alert', 'warning', 'problem', 'crown', 'crown'], [body(poly([[3, 6], [6.5, 9.5], [9.5, 4.5], [12.5, 9.5], [16, 6], [15, 15], [4, 15]], 0.8, true)), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
  ],
};
