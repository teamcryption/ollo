import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, poly, rotateD } from '../src/geo.mjs';

const rot = (els, deg) => els.map((e) => ({ ...e, d: rotateD(e.d, deg) }));

export default {
  category: 'food',
  icons: [
    icon('baguette', 'Baguette', ['bread', 'french bread', 'bakery', 'loaf', 'stick'], rot([body(E(12, 12, 9.3, 3.2)), line('M7.8 10.2l1 3.6M11.5 10l1 4M15.2 10.2l1 3.6')], -45), { noAccent: true }),
    icon('pie', 'Pie', ['tart', 'baked', 'dessert', 'apple pie', 'bakery'], [body('M3.5 12a8.5 4.5 0 0 1 17 0Z'), body(poly([[3.5, 12.8], [20.5, 12.8], [18.5, 19], [5.5, 19]], 1, true)), accent('M10 3.5v2M14 3.5v2')]),
    icon('wine-bottle', 'Wine Bottle', ['wine', 'bottle', 'red wine', 'drink', 'vineyard'], [body('M10 3.5h4v4.5c2 1 3 2.5 3 4.5v7a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 19.5v-7c0-2 1-3.5 3-4.5Z'), accent(L(9.5, 15, 14.5, 15))]),
    icon('thermos', 'Thermos', ['flask', 'vacuum flask', 'hot drink', 'travel mug', 'coffee'], [body(R(8.5, 3, 7, 2.5, 1)), body(R(7.5, 6.5, 9, 14, 2.5)), accent(L(10, 11, 10, 16))]),
    icon('cherry', 'Cherry', ['cherries', 'fruit', 'berry', 'sweet', 'summer'], [line('M7.5 12.5C9 8 11 5.5 14 4M16 13.5c-.5-4-1-7-2-9.5'), body(C(7.5, 16, 3.5)), body(C(16, 17, 3.5))], { noAccent: true }),
    icon('lemon', 'Lemon', ['citrus', 'fruit', 'sour', 'lime', 'zest'], rot([body(E(12, 12, 7.5, 5.5)), line('M3 12h1.5M19.5 12H21'), accent('M9.5 10.3c.8-.9 1.7-1.3 2.7-1.3')], -30)),
    icon('eggplant', 'Eggplant', ['aubergine', 'vegetable', 'brinjal', 'veggie', 'purple'], [body('M15.5 8.5c2.5 2 2.5 5.5 0 8.5s-7 5-9.5 2.5 0-6 3-8.5 4-4.5 6.5-2.5Z'), line('M12.8 8.2c1.5.2 2.8 0 3.7-1 .3 1.3.9 2.3 2 2.8M16.5 7.2l1.8-3.4')], { noAccent: true }),
    icon('peas', 'Peas', ['pea pod', 'vegetable', 'green', 'legume', 'veggie'], rot([body(E(12, 12, 9.2, 4.6)), line(C(8, 12, 1.8) + C(12, 12, 1.8) + C(16, 12, 1.8))], -30), { noAccent: true }),
  ],
};
