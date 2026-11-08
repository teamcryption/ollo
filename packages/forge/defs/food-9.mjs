import { R, C, L, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const GRAPES = [[8, 9], [12, 9], [16, 9], [10, 12.5], [14, 12.5], [12, 16]];

export default {
  category: 'food',
  icons: [
    icon('whisk', 'Whisk', ['baking', 'beat', 'kitchen', 'mix', 'cooking'], [body(rotateD(R(10.8, 13.5, 2.4, 7, 1.2), 30)), line(rotateD('M12 13.5c-3.5-2-5-5-5-7.5A2.5 2.5 0 0 1 9.5 3.5h5A2.5 2.5 0 0 1 17 6c0 2.5-1.5 5.5-5 7.5M12 13.5c-1.3-2.5-1.8-5-1.8-7 0-1.5.8-3 1.8-3s1.8 1.5 1.8 3c0 2-.5 4.5-1.8 7', 30))], { noAccent: true }),
    icon('rolling-pin', 'Rolling Pin', ['baking', 'dough', 'pastry', 'kitchen', 'roll'], [body(rotateD(R(3, 10.8, 3.5, 2.4, 1.2), -35)), body(rotateD(R(17.5, 10.8, 3.5, 2.4, 1.2), -35)), body(rotateD(R(6.5, 8.5, 11, 7, 2.5), -35))], { noAccent: true }),
    icon('ladle', 'Ladle', ['soup', 'serve', 'kitchen', 'scoop', 'cooking'], [line(L(13.5, 15, 18.5, 4.5)), line('M18.5 4.5a1.3 1.3 0 0 1 2.2 1.3'), body('M3.5 15h10a5 5 0 0 1-10 0Z')], { noAccent: true }),
    icon('mug', 'Mug', ['cup', 'tea', 'hot drink', 'coffee mug', 'beverage'], [line('M16 10h1.5a3 3 0 0 1 0 6H16'), body(R(4, 7, 12, 13.5, 2)), accent('M8 3.5v1.5M12 3.5v1.5')]),
    icon('bowl', 'Bowl', ['soup', 'meal', 'dish', 'cereal', 'food'], [body('M3.5 10.5h17c0 4.2-3.4 7.5-7.5 7.5h-2c-4.1 0-7.5-3.3-7.5-7.5Z'), line(L(9, 20.5, 15, 20.5)), accent('M10 3.5c-.8.8-.8 1.7 0 2.5s.8 1.7 0 2.5M14 3.5c-.8.8-.8 1.7 0 2.5s.8 1.7 0 2.5')]),
    icon('grapes', 'Grapes', ['fruit', 'vine', 'wine', 'bunch', 'harvest'], [line('M12 7.1V3.5M12 5c1.5-1.5 3.5-1.8 5-1'), ...GRAPES.map(([x, y]) => body(C(x, y, 1.9)))], { noAccent: true }),
    icon('pear', 'Pear', ['fruit', 'healthy', 'produce', 'orchard', 'snack'], [line(L(12, 6, 12.8, 3.5)), line('M13.6 4.6c1.4-1 2.8-1 3.9 0-1 1.3-2.5 1.5-3.9 0Z'), body('M12 6c1.8 0 2.8 1.5 3 3.5.2 1.7 3 3 3 6.5 0 3-2.7 4.5-6 4.5s-6-1.5-6-4.5c0-3.5 2.8-4.8 3-6.5C9.2 7.5 10.2 6 12 6Z')], { noAccent: true }),
    icon('corn', 'Corn', ['maize', 'cob', 'vegetable', 'harvest', 'farm'], [body('M12 3.5c2.2 0 3.5 3 3.5 7.5s-1.3 7-3.5 7-3.5-2.5-3.5-7 1.3-7.5 3.5-7.5Z'), line('M8.8 8h6.4M8.6 11.5h6.8M9 15h6M12 3.5v14'), line('M12 20.5c-3 0-5.5-2.5-6-8 2 1.5 3.5 3.5 4 6M12 20.5c3 0 5.5-2.5 6-8-2 1.5-3.5 3.5-4 6')], { noAccent: true }),
    icon('lollipop', 'Lollipop', ['candy', 'sweet', 'sugar', 'treat', 'dessert'], [line(L(12, 15, 12, 20.5)), body(C(12, 9, 6)), line('M12 9.5a1 1 0 0 1-1-1 2 2 0 0 1 2-2 3 3 0 0 1 3 3 4 4 0 0 1-4 4')], { noAccent: true }),
    icon('croissant', 'Croissant', ['pastry', 'bakery', 'breakfast', 'french', 'bread'], [body('M3.5 16c.5-5 4-9 8.5-9s8 4 8.5 9c-2.5-2-5.5-3-8.5-3s-6 1-8.5 3Z'), line('M9 7.8l.8 5.5M15 7.8l-.8 5.5')], { noAccent: true }),
  ],
};
