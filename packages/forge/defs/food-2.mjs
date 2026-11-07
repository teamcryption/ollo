import { R, C, L, A, poly, D, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'food',
  icons: [
    icon('egg-fried', 'Fried Egg', ['breakfast', 'egg', 'cooking', 'brunch'], [body('M12 3.5c3 0 4.5 2.2 6 3.7 1.7 1.6 3 3.6 2.4 6.3-.7 3.2-3.2 5-6.4 6.5-3 1.4-6.3 1.3-8.5-1C3.4 16.8 3 14 4.2 11.3 5.6 8.3 8 3.5 12 3.5Z'), accent(C(11.5, 12, 2.8))]),
    icon('carrot', 'Carrot', ['vegetable', 'veggie', 'healthy', 'vegan', 'produce'], [body(rotateD('M9 10a3 3 0 0 1 6 0L12 21Z', 40, 12, 12)), line(rotateD('M12 7V4', 40, 12, 12)), line(rotateD('M12 7 9.5 4.5', 40, 12, 12)), line(rotateD('M12 7l2.5-2.5', 40, 12, 12))], { noAccent: true }),
    icon('bread', 'Bread', ['toast', 'bakery', 'loaf', 'breakfast'], [body('M5.5 20.5V12A3.5 3.5 0 0 1 5 5.3C6.5 4 9 3.5 12 3.5s5.5.5 7 1.8a3.5 3.5 0 0 1-.5 6.7v8.5Z'), accent(L(9.5, 15, 14.5, 15))]),
    icon('cheese', 'Cheese', ['dairy', 'wedge', 'snack', 'food'], [body(poly([[3.5, 11.5], [17, 5], [20.5, 11.5], [20.5, 19], [3.5, 19]], 1, true)), line(L(3.7, 11.5, 20.3, 11.5)), accent(C(9, 15.2, 1.5)), line(C(15.5, 15.5, 1))]),
    icon('chef-hat', 'Chef Hat', ['cook', 'kitchen', 'recipe', 'chef', 'cuisine'], [body('M7 14.5a3.5 3.5 0 0 1-.6-6.9 7 7 0 0 1 11.2 0A3.5 3.5 0 0 1 17 14.5Z'), line(R(7, 16, 10, 4.5, 1)), accent(L(9.5, 18.25, 14.5, 18.25))]),
    icon('noodles', 'Noodles', ['ramen', 'bowl', 'soup', 'asian food', 'pho'], [line(L(11, 9, 19, 3.5)), line(L(13, 9.5, 20.5, 5.5)), body('M3.5 11h17a8.5 8 0 0 1-17 0Z'), accent(L(6, 6, 6, 8.5))]),
    icon('cookie', 'Cookie', ['biscuit', 'snack', 'sweet', 'treat', 'cookies'], [body('M19.94 8.97A8.5 8.5 0 1 1 16.13 4.57a3.5 3.5 0 0 0 3.81 4.4Z'), line(D(8.5, 8.5)), line(D(13.5, 8.5)), accent(D(12.5, 14)), line(D(8, 15)), line(D(16.3, 13))]),
    icon('donut', 'Donut', ['doughnut', 'sweet', 'dessert', 'bakery'], [body(C(12, 12, 8.5)), line(C(12, 12, 3)), accent(L(7, 9, 8, 7.8)), line(L(15.5, 6.5, 16.6, 7.6)), line(L(16.5, 15.5, 15.4, 16.8)), line(L(7.5, 15, 8.5, 16.4))]),
    icon('cherries', 'Cherries', ['fruit', 'cherry', 'berry', 'summer'], [body(C(7.5, 16.5, 3.5)), body(C(16.5, 17, 3.5)), line('M7.5 13c1-4 3-7 6-9.5'), line('M16.5 13.5c-.5-3.5-1-6.5-3-10'), line('M13.5 3.5c1.5-.8 3.5-.8 5 .5-1.5 1-3.5 1.3-5-.5Z')], { noAccent: true }),
    icon('soda-cup', 'Soft Drink', ['soda', 'drink', 'cola', 'takeaway', 'beverage'], [line('M12 7.5l1.5-4H16'), line(L(5, 7.5, 19, 7.5)), body('M6 8h12l-1.5 12.5h-9Z'), accent(L(9, 13, 15, 13))]),
    icon('chili', 'Chili Pepper', ['spicy', 'hot', 'pepper', 'chilli'], [line('M7 8V6.5A2.5 2.5 0 0 1 9.5 4'), body('M7 8c1.5 0 2 .8 2.3 2 .7 4 3.5 7.5 9.5 8.5 1 .2 1 1.5 0 1.7C12 21.5 5.5 18.5 5 11.5 4.8 9.3 5.5 8 7 8Z')], { noAccent: true }),
    icon('beer-mug', 'Beer', ['pint', 'pub', 'bar', 'drink', 'ale'], [line('M5 6a2.5 2.5 0 0 1 4-2 2.5 2.5 0 0 1 3.5 0 2.5 2.5 0 0 1 3 2'), body(R(5, 6, 10, 14.5, 2)), line('M15 9h2a2.5 2.5 0 0 1 2.5 2.5v3A2.5 2.5 0 0 1 17 17h-2'), accent(L(8.5, 10, 8.5, 16.5)), line(L(11.5, 10, 11.5, 16.5))]),
  ],
};
