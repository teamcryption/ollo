import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'food',
  icons: [
    icon('pizza-clock', 'Delivery Time', ['food eta', 'order tracking', 'pizza delivery', 'food', 'pizza'], [body(poly([[3, 4.5], [16, 7.5], [6.5, 17]], 1, true)), line('M3.4 7.5 13.5 9.6'), line(D(7, 10.5) + D(9.5, 13) + D(10.5, 10.5)), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('pizza-pin', 'Pizza Nearby', ['pizzeria location', 'restaurant map', 'food', 'pizza', 'pizza'], [body(poly([[3, 4.5], [16, 7.5], [6.5, 17]], 1, true)), line('M3.4 7.5 13.5 9.6'), line(D(7, 10.5) + D(9.5, 13) + D(10.5, 10.5)), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('pizza-heart', 'Favourite Food', ['loved meal', 'order again', 'favourite', 'pizza', 'pizza'], [body(poly([[3, 4.5], [16, 7.5], [6.5, 17]], 1, true)), line('M3.4 7.5 13.5 9.6'), line(D(7, 10.5) + D(9.5, 13) + D(10.5, 10.5)), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
  ],
};
