import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'home',
  icons: [
    icon('food-processor', 'Food Processor', ['chopper', 'kitchen appliance', 'blend', 'prep', 'mixer'], [body(poly([[6, 6.5], [18, 6.5], [17, 14.3], [7, 14.3]], 1, true)), line('M14 6.5V3.5h3v3'), line('M9.5 10.5h5'), body(R(5, 15.5, 14, 5, 1.5))], { noAccent: true }),
    icon('coffee-grinder', 'Coffee Grinder', ['grinder', 'coffee beans', 'barista', 'manual grinder', 'kitchen'], [line('M12 7V4.5h4.5'), body(C(17.6, 4.5, 1.2)), body(poly([[7, 7], [17, 7], [15.5, 9.8], [8.5, 9.8]], 0.6, true)), body(R(6, 11, 12, 9.5, 1.5)), line('M9.5 16h5')], { noAccent: true }),
    icon('deep-fryer', 'Deep Fryer', ['fryer', 'frying', 'fries', 'kitchen appliance', 'oil'], [body(R(4, 9, 13, 11, 2)), line('M4.2 12.5h12.6'), line('M17 10 20.5 6.5')], { noAccent: true }),
    icon('dishwasher', 'Dishwasher', ['dishes', 'kitchen appliance', 'clean', 'washing', 'cycle'], [body(R(5, 3.5, 14, 17, 1.5)), line('M5.2 7.5h13.6'), line(D(8, 5.5) + D(10.5, 5.5)), accent(L(10, 11, 14, 11))]),
    icon('freezer', 'Chest Freezer', ['freezer', 'frozen food', 'deep freeze', 'cold storage', 'appliance'], [body(R(3.5, 8, 17, 12, 1.5)), line('M3.7 11.5h16.6'), accent(L(10, 15, 14, 15))]),
    icon('kitchen-scale', 'Kitchen Scale', ['food scale', 'weigh', 'baking', 'grams', 'measure'], [body('M5.5 9h13c0 2-2.9 3.2-6.5 3.2S5.5 11 5.5 9Z'), body(R(4, 13, 16, 7, 2)), line(R(9, 15.3, 6, 2.5, 0.8))], { noAccent: true }),
    icon('meat-thermometer', 'Meat Thermometer', ['probe thermometer', 'cooking temperature', 'bbq', 'roast', 'kitchen'], [body(C(12, 8, 4.5)), line('M12 8l2-2'), line('M12 12.5v8')], { noAccent: true }),
    icon('hand-blender', 'Hand Blender', ['immersion blender', 'stick blender', 'soup', 'puree', 'kitchen'], [body(R(9.5, 3.5, 5, 10, 2.5)), line(D(12, 6.5)), line('M12 13.5v3'), body('M9 16.5h6l-.8 3.5a1 1 0 0 1-1 .8h-2.4a1 1 0 0 1-1-.8Z')], { noAccent: true }),
  ],
};
