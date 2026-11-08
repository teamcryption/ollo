import { R, L, D, C, poly, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'home',
  icons: [
    icon('towel', 'Towel', ['bathroom', 'bath', 'dry', 'hotel', 'spa'], [line(L(3.5, 5.5, 20.5, 5.5)), body('M6.5 5.5h11v13a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2Z', { cover: true }), line('M6.5 15h11')], { noAccent: true }),
    icon('laundry-basket', 'Laundry Basket', ['laundry', 'clothes', 'hamper', 'washing', 'basket'], [line('M7 9c0-2.2 1.8-4 4-4h2c2.2 0 4 1.8 4 4'), body(poly([[3.5, 9], [20.5, 9], [18.5, 20.5], [5.5, 20.5]], 1, true)), line('M4.8 13h14.4M5.4 16.8h13.2')], { noAccent: true }),
    icon('clothespin', 'Clothespin', ['peg', 'laundry', 'clip', 'washing line', 'hang'], [body(rotateD('M9.5 3.5h5l-1 17h-3Z', 35)), line(rotateD(L(12, 3.5, 12, 10.4), 35)), line(rotateD(C(12, 12, 1.6), 35))], { noAccent: true }),
    icon('spray-bottle', 'Spray Bottle', ['cleaning', 'spray', 'mist', 'cleaner', 'housework'], [line('M12.5 6.5 15 10'), body(poly([[7, 8], [7, 3.5], [15.5, 3.5], [17, 6], [12.5, 6], [12.5, 8]], 0.5, true)), body(R(6, 8, 8, 12.5, 2)), accent(D(19.5, 3.8) + D(20.5, 6) + D(19.5, 8.2))]),
    icon('radiator', 'Radiator', ['heating', 'heater', 'warm', 'central heating', 'room'], [line('M6.5 8h2M11 8h2M15.5 8h2M6.5 15h2M11 15h2M15.5 15h2M5.25 18v2.5M18.75 18v2.5'), ...[4, 8.5, 13, 17.5].map((x) => body(R(x, 5, 2.5, 13, 1.25)))], { noAccent: true }),
    icon('vase', 'Vase', ['pottery', 'decor', 'flowers', 'ceramic', 'urn'], [body('M7.5 3.5h9L14 7c2.6 1.8 4 4.4 4 7.5 0 3.7-2.4 6-6 6s-6-2.3-6-6c0-3.1 1.4-5.7 4-7.5Z'), line('M7.6 10.5h8.8')], { noAccent: true }),
  ],
};
