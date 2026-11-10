import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, poly, gear } from '../src/geo.mjs';

export default {
  category: 'food',
  icons: [
    icon('nachos', 'Nachos', ['tortilla chips', 'mexican', 'snack', 'chips', 'salsa'], [body(poly([[4, 17], [10.5, 4.5], [14, 14]], 1, true)), body(poly([[9.5, 19.5], [20.5, 16], [17, 6.5]], 1, true), { cover: true }), accent(D(9.5, 12.5))]),
    icon('sandwich', 'Sandwich', ['lunch', 'sub', 'bread', 'deli', 'snack'], [body(R(3.5, 5, 17, 4.5, 1.5)), line('M3.5 12.5c1.5-1 2.5 1 4 0s2.5-1 4 0 2.5 1 4 0 2.5-1 4 0'), body(R(3.5, 15.5, 17, 4, 1.5))], { noAccent: true }),
    icon('tea-cup', 'Tea Cup', ['teacup', 'saucer', 'tea', 'afternoon tea', 'drink'], [body('M5 8.5h11v3a5.5 5.5 0 0 1-11 0Z'), line('M16 10h1a2 2 0 0 1 0 4h-1.5M3.5 20h17'), accent('M9 3.5v2.5M12.5 3.5v2.5')]),
    icon('french-press', 'French Press', ['coffee press', 'cafetiere', 'brew', 'coffee', 'plunger'], [line('M11 7V3.5M8.5 3.5h5M5.5 7h11'), body(R(6, 7, 10, 13.5, 1.5)), line('M6.2 12h9.6M16 9.5h2.5v8H16')], { noAccent: true }),
    icon('bottle-cap', 'Bottle Cap', ['crown cap', 'soda', 'beer', 'lid', 'recycling'], [body(gear(12, 12, 8.5, 7.4, 21, 0.3)), line(C(12, 12, 4.5))], { noAccent: true }),
    icon('hot-sauce', 'Hot Sauce', ['chili sauce', 'spicy', 'condiment', 'sriracha', 'bottle'], [body(R(10.5, 3, 3, 2.5, 0.8)), body('M10.5 5.5h3v2.5l2.5 3V19a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 8 19v-8l2.5-3Z'), accent('M12 12.5c1.2 1.4 1.8 2.4 1.8 3.3a1.8 1.8 0 0 1-3.6 0c0-.9.6-1.9 1.8-3.3Z')]),
    icon('takeout-box', 'Takeout Box', ['takeaway', 'chinese food', 'noodle box', 'delivery', 'to go'], [line('M8.5 6c0-2 1.5-3 3.5-3s3.5 1 3.5 3'), line('M5 9 7 6h10l2 3'), body(poly([[5, 9], [19, 9], [17, 20.5], [7, 20.5]], 1, true))], { noAccent: true }),
    icon('cloche', 'Cloche', ['serving dome', 'room service', 'dinner', 'restaurant', 'platter'], [body(C(12, 5.3, 1.5)), body('M4 16a8 8 0 0 1 16 0Z'), line('M3 18.5h18')], { noAccent: true }),
  ],
};
