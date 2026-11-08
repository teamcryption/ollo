import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, L, poly, rotateD } from '../src/geo.mjs';

const KEBAB = [line('M12 2.5v3M12 18.5v3'), body(R(9.5, 5.5, 5, 3.5, 1)), body(C(12, 12, 2.4)), body(R(9.5, 15, 5, 3.5, 1))];

export default {
  category: 'food',
  icons: [
    icon('waffle', 'Waffle', ['breakfast', 'brunch', 'belgian waffle', 'sweet', 'grid'], [body(R(4, 4, 16, 16, 4)), line('M9.5 4.5v15M14.5 4.5v15M4.5 9.5h15M4.5 14.5h15')], { noAccent: true }),
    icon('pancakes', 'Pancakes', ['breakfast', 'stack', 'brunch', 'syrup', 'hotcakes'], [body(R(3.5, 16.5, 17, 3.5, 1.75)), body(R(4.5, 13, 15, 3.5, 1.75), { cover: true }), body(R(5.5, 9.5, 13, 3.5, 1.75), { cover: true }), accent(R(10, 5.3, 4, 2, 0.6))]),
    icon('popsicle', 'Popsicle', ['ice lolly', 'ice pop', 'frozen', 'summer', 'dessert'], [body('M7.5 9a4.5 4.5 0 0 1 9 0v8h-9Z'), line('M12 17v3.5'), accent(L(10, 9.5, 10, 14))]),
    icon('dumpling', 'Dumpling', ['gyoza', 'dim sum', 'momo', 'asian food', 'steamed'], [body('M3.5 15c0-4.5 3.8-8 8.5-8s8.5 3.5 8.5 8c0 1.5-1.2 2.5-2.7 2.5H6.2c-1.5 0-2.7-1-2.7-2.5Z'), line('M9 7.6l1 3M12 7v3.2M15 7.6l-1 3'), accent('M10 3v2M14 3v2')]),
    icon('cake-slice', 'Cake Slice', ['dessert', 'piece of cake', 'bakery', 'birthday', 'sweet'], [body(poly([[3.5, 20], [3.5, 9], [20.5, 14.5], [20.5, 20]], 0.8, true)), line('M3.5 15.5h17'), accent(C(6.2, 5.3, 1.5))]),
    icon('soda-can', 'Soda Can', ['soft drink', 'cola', 'beverage', 'tin', 'pop'], [body('M8 4.5h8l1 2v12l-1 2H8l-1-2v-12Z'), line('M10.5 3h3'), accent('M9.5 12.5c1-1 2-1 2.5 0s1.5 1 2.5 0')]),
    icon('juice-box', 'Juice Box', ['drink', 'carton', 'straw', 'kids', 'beverage'], [line('M14.5 7.5V3.5l3-.5'), body(R(6, 7.5, 12, 13, 1.5)), accent('M9 12.5h6M9 15.5h3.5')]),
    icon('kebab', 'Kebab', ['skewer', 'grill', 'bbq', 'shish kebab', 'meat'], KEBAB.map((e) => ({ ...e, d: rotateD(e.d, 45) })), { noAccent: true }),
  ],
};
