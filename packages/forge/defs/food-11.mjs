import { E, R, C, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'food',
  icons: [
    icon('pineapple', 'Pineapple', ['fruit', 'tropical', 'summer', 'ananas', 'produce'], [line('M12 9.2V4M12 9.2 8.5 5.2M12 9.2l3.5-4'), body(E(12, 14.8, 5, 5.6)), line('M8.5 12.5l1.75 1.5 1.75-1.5 1.75 1.5 1.75-1.5M8.5 16l1.75 1.5 1.75-1.5 1.75 1.5 1.75-1.5')], { noAccent: true }),
    icon('garlic', 'Garlic', ['clove', 'bulb', 'vegetable', 'cooking', 'spice'], [body('M12 3.5c0 3-6.5 5-6.5 10.5a6.5 6.5 0 0 0 13 0C18.5 8.5 12 6.5 12 3.5Z'), line('M12 9.5c-2 2-2.5 5-2.5 8M12 9.5c2 2 2.5 5 2.5 8')], { noAccent: true }),
    icon('coffee-bean', 'Coffee Bean', ['coffee', 'roast', 'espresso', 'cafe', 'caffeine'], [body(rotateD(E(12, 12, 5.5, 8), 35)), line(rotateD('M12 4.5c-2 2.5-2 5 0 7.5s2 5 0 7.5', 35))], { noAccent: true }),
    icon('blender', 'Blender', ['smoothie', 'mixer', 'kitchen', 'appliance', 'juice'], [line('M16.7 7h1.8a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.3'), body('M6 4.5h11l-1 9.5H7Z'), line('M10 11h3'), body(R(6.5, 14, 11, 6.5, 1.5)), accent(C(12, 17.25, 1.2))]),
  ],
};
