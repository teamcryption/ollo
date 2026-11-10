import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'commerce',
  icons: [
    icon('crown-search', 'Search Crown', ['search', 'find', 'lookup', 'crown', 'crown'], [body(poly([[3, 6], [6.5, 9.5], [9.5, 4.5], [12.5, 9.5], [16, 6], [15, 15], [4, 15]], 0.8, true)), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('tag-shield', 'Tag Protection', ['protected', 'secure', 'safety', 'tag', 'tag'], [body('M3 4.5A1.5 1.5 0 0 1 4.5 3h4.8a1.5 1.5 0 0 1 1.1.4l5 5a1.5 1.5 0 0 1 0 2.2l-4.6 4.6a1.5 1.5 0 0 1-2.2 0l-5-5A1.5 1.5 0 0 1 3 9.1Z'), line(D(6.5, 6.5)), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('basket-shield', 'Basket Protection', ['protected', 'secure', 'safety', 'basket', 'basket'], [line('M6.5 8.5 9.5 4l3 4.5'), body(poly([[3, 8.5], [16, 8.5], [14.5, 16.5], [4.5, 16.5]], 1, true)), line('M7.5 11v3M11.5 11v3'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('crown-shield', 'Crown Protection', ['protected', 'secure', 'safety', 'crown', 'crown'], [body(poly([[3, 6], [6.5, 9.5], [9.5, 4.5], [12.5, 9.5], [16, 6], [15, 15], [4, 15]], 0.8, true)), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
    icon('bag-gear', 'Bag Settings', ['settings', 'configure', 'preferences', 'bag', 'bag'], [line('M7 7.5V6.5a2.5 2.5 0 0 1 5 0v1'), body('M4.5 8.8A1.3 1.3 0 0 1 5.8 7.5h7.4a1.3 1.3 0 0 1 1.3 1.3l.6 8.5a1.8 1.8 0 0 1-1.8 1.9H5.7a1.8 1.8 0 0 1-1.8-1.9Z'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('cart-gear', 'Cart Settings', ['settings', 'configure', 'preferences', 'cart', 'cart'], [line('M3 4.5h1.8l1.8 8.5h6.2l1.2-5.5H5.6'), line(D(7, 16.5) + D(11.5, 16.5)), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('tag-gear', 'Tag Settings', ['settings', 'configure', 'preferences', 'tag', 'tag'], [body('M3 4.5A1.5 1.5 0 0 1 4.5 3h4.8a1.5 1.5 0 0 1 1.1.4l5 5a1.5 1.5 0 0 1 0 2.2l-4.6 4.6a1.5 1.5 0 0 1-2.2 0l-5-5A1.5 1.5 0 0 1 3 9.1Z'), line(D(6.5, 6.5)), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('ticket-gear', 'Ticket Settings', ['settings', 'configure', 'preferences', 'ticket', 'ticket'], [body('M3 7.5A1.5 1.5 0 0 1 4.5 6h10A1.5 1.5 0 0 1 16 7.5V9a1.5 1.5 0 0 0 0 3v1.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 13.5V12a1.5 1.5 0 0 0 0-3Z'), line('M11 6.5v1.5M11 10v1M11 13v1.5'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('basket-gear', 'Basket Settings', ['settings', 'configure', 'preferences', 'basket', 'basket'], [line('M6.5 8.5 9.5 4l3 4.5'), body(poly([[3, 8.5], [16, 8.5], [14.5, 16.5], [4.5, 16.5]], 1, true)), line('M7.5 11v3M11.5 11v3'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('crown-pin', 'Crown Location', ['location', 'place', 'map', 'crown', 'crown'], [body(poly([[3, 6], [6.5, 9.5], [9.5, 4.5], [12.5, 9.5], [16, 6], [15, 15], [4, 15]], 0.8, true)), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('crown-bolt', 'Instant Crown', ['quick', 'fast', 'instant', 'crown', 'crown'], [body(poly([[3, 6], [6.5, 9.5], [9.5, 4.5], [12.5, 9.5], [16, 6], [15, 15], [4, 15]], 0.8, true)), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
