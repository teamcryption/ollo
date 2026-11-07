import { R, C, L, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'food',
  icons: [
    icon('coffee', 'Coffee', ['cup', 'cafe', 'drink', 'tea', 'break'], [body('M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5Z'), line('M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16'), line(L(4, 21, 17, 21)), accent('M10.5 3.5c-.8.8-.8 1.7 0 2.5')], { anim: 'pulse' }),
    icon('restaurant', 'Restaurant', ['fork', 'knife', 'dining', 'food', 'eat'], [line(L(7, 3.5, 7, 20.5)), line('M4.5 3.5V8a2.5 2.5 0 0 0 5 0V3.5'), line('M17 20.5V3.5c-2 1-3.5 3.5-3.5 7.5v1.5H17')], { noAccent: true }),
    icon('pizza', 'Pizza', ['slice', 'fast food', 'italian', 'food'], [body(poly([[3.5, 6.5], [20.5, 6.5], [12, 21]], 1, true)), line('M3.5 6.5C6 4.5 9 3.5 12 3.5s6 1 8.5 3'), line(D(9, 10)), accent(C(12.5, 11.5, 1.3))]),
    icon('apple', 'Apple', ['fruit', 'healthy', 'snack', 'food'], [body('M12 7.5c-1.5-1-5.5-1.5-6.5 2.5-1 4 1.5 10 4 10 1 0 1.5-.5 2.5-.5s1.5.5 2.5.5c2.5 0 5-6 4-10-1-4-5-3.5-6.5-2.5Z'), line('M12 7.5c0-2 .5-3 1.5-4')], { noAccent: true }),
    icon('burger', 'Burger', ['hamburger', 'fast food', 'meal', 'sandwich'], [body('M4.5 10.5a7.5 6 0 0 1 15 0Z'), line(L(3.5, 13.5, 20.5, 13.5)), body('M4.5 16.5h15v1a2.5 2.5 0 0 1-2.5 2.5H7a2.5 2.5 0 0 1-2.5-2.5Z'), line(D(14, 7.5)), accent(D(10, 7.5))]),
    icon('wine-glass', 'Wine Glass', ['wine', 'drink', 'bar', 'alcohol', 'cheers'], [body('M8 3.5h8l.5 4a4.5 4.5 0 0 1-9 0Z'), line(L(12, 12, 12, 20)), line(L(8.5, 20.5, 15.5, 20.5))], { noAccent: true }),
    icon('cake', 'Cake', ['birthday', 'dessert', 'celebration', 'bakery'], [body(R(4, 11, 16, 9, 2)), line('M4.2 15c2 1.5 3.8 1.5 5.2 0s3.6-1.5 5.2 0 3.4 1.5 5.4 0'), line(L(12, 8, 12, 11)), accent('M12 3c.7.9 1 1.5 1 2a1 1 0 0 1-2 0c0-.5.3-1.1 1-2Z')], { anim: 'pulse' }),
    icon('ice-cream', 'Ice Cream', ['dessert', 'cone', 'sweet', 'summer'], [body(poly([[7.5, 11], [16.5, 11], [12, 21]], 0.8, true)), body('M7 11a5 5 0 0 1 10 0Z')], { noAccent: true }),
    icon('bottle', 'Bottle', ['water', 'drink', 'hydration', 'beverage'], [body(R(8, 7, 8, 14, 2.5)), line('M10 7V4.5h4V7'), accent(L(10.5, 12, 13.5, 12))]),
  ],
};
