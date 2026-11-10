import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'commerce',
  icons: [
    icon('basket-heart', 'Grocery Wishlist', ['saved groceries', 'favourite products', 'shopping basket', 'list', 'basket'], [line('M6.5 8.5 9.5 4l3 4.5'), body(poly([[3, 8.5], [16, 8.5], [14.5, 16.5], [4.5, 16.5]], 1, true)), line('M7.5 11v3M11.5 11v3'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('basket-clock', 'Order Again', ['repeat order', 'regular shop', 'subscription', 'basket', 'basket'], [line('M6.5 8.5 9.5 4l3 4.5'), body(poly([[3, 8.5], [16, 8.5], [14.5, 16.5], [4.5, 16.5]], 1, true)), line('M7.5 11v3M11.5 11v3'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('basket-star', 'Top Products', ['best groceries', 'featured items', 'popular', 'basket', 'basket'], [line('M6.5 8.5 9.5 4l3 4.5'), body(poly([[3, 8.5], [16, 8.5], [14.5, 16.5], [4.5, 16.5]], 1, true)), line('M7.5 11v3M11.5 11v3'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('basket-search', 'Find Groceries', ['product search', 'shop lookup', 'groceries', 'basket', 'basket'], [line('M6.5 8.5 9.5 4l3 4.5'), body(poly([[3, 8.5], [16, 8.5], [14.5, 16.5], [4.5, 16.5]], 1, true)), line('M7.5 11v3M11.5 11v3'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('basket-pin', 'Grocery Pickup', ['click and collect', 'pickup point', 'groceries', 'basket', 'basket'], [line('M6.5 8.5 9.5 4l3 4.5'), body(poly([[3, 8.5], [16, 8.5], [14.5, 16.5], [4.5, 16.5]], 1, true)), line('M7.5 11v3M11.5 11v3'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
  ],
};
