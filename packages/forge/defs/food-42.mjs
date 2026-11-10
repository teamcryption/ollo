import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'food',
  icons: [
    icon('cake-star', 'Featured Cake', ['featured', 'top rated', 'best', 'cake', 'cake'], [line('M9.5 9.5V6.5'), line(D(9.5, 4.8)), body(R(4, 10, 11, 7, 1.5)), line('M4.2 13c1.2 1 2.4 1 3.6 0s2.4-1 3.6 0 2.4 1 3.6 0'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('coffee-alert', 'Coffee Alert', ['alert', 'warning', 'problem', 'coffee', 'coffee'], [body('M4 7.5h9V12a4.5 4.5 0 0 1-9 0Z'), line('M13 8.5h1a2 2 0 0 1 0 4h-1M7 3.5v2M10 3.5v2'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('pizza-alert', 'Pizza Alert', ['alert', 'warning', 'problem', 'pizza', 'pizza'], [body(poly([[3, 4.5], [16, 7.5], [6.5, 17]], 1, true)), line('M3.4 7.5 13.5 9.6'), line(D(7, 10.5) + D(9.5, 13) + D(10.5, 10.5)), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('restaurant-alert', 'Restaurant Alert', ['alert', 'warning', 'problem', 'restaurant', 'restaurant'], [line('M5 3.5v5a2 2 0 0 0 4 0v-5M7 3.5v14M13.5 3.5c-1.5 0-2.5 2-2.5 5h2.5v9'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('cake-alert', 'Cake Alert', ['alert', 'warning', 'problem', 'cake', 'cake'], [line('M9.5 9.5V6.5'), line(D(9.5, 4.8)), body(R(4, 10, 11, 7, 1.5)), line('M4.2 13c1.2 1 2.4 1 3.6 0s2.4-1 3.6 0 2.4 1 3.6 0'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
  ],
};
