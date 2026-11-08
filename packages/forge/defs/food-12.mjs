import { R, E, L, D, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'food',
  icons: [
    icon('spoon', 'Spoon', ['cutlery', 'soup', 'eat', 'utensil', 'tableware'], [body(rotateD(E(12, 7.5, 3.3, 4.5), 30)), body(rotateD(R(11, 12, 2, 8.8, 1), 30))], { noAccent: true }),
    icon('chopsticks', 'Chopsticks', ['asian', 'eat', 'noodles', 'utensil', 'sushi'], [line('M3.5 5l11 10.5M7.5 3.5l8 11'), accent(E(18.5, 18.5, 1.9, 1.5))]),
    icon('stand-mixer', 'Stand Mixer', ['mixer', 'baking', 'kitchen', 'appliance', 'dough'], [body('M5 20.5h14v-2.5H8.5V10H15a3 3 0 0 0 0-6H8a3 3 0 0 0-3 3Z'), line(L(14, 10, 14, 12)), body('M10 12.5h8a4 4 0 0 1-8 0Z')], { noAccent: true }),
    icon('oven', 'Oven', ['stove', 'bake', 'kitchen', 'appliance', 'cooking'], [body(R(4, 3.5, 16, 17, 2)), line('M4 8h16'), line(D(7, 5.8) + D(10, 5.8)), line(R(7, 11, 10, 6.5, 1))], { noAccent: true }),
  ],
};
