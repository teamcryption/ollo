import { icon, body, line, accent } from '../src/dsl.mjs';
import { C, D, E, rotateD } from '../src/geo.mjs';

const seeds = [0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const r = a * Math.PI / 180; return D(12 + 5.4 * Math.cos(r), 12 + 5.4 * Math.sin(r)); }).join('');

export default {
  category: 'food',
  icons: [
    icon('kiwi', 'Kiwi', ['kiwifruit', 'fruit', 'tropical', 'vitamin c', 'slice'], [body(C(12, 12, 8.5)), line(E(12, 12, 2.6, 1.8)), accent(seeds)]),
    icon('bacon', 'Bacon', ['breakfast', 'pork', 'strips', 'brunch', 'meat'], [body('M3.5 7c3-2 5 2 8.5 0s5.5-2 8.5 0v3.5c-3-2-5 2-8.5 0s-5.5-2-8.5 0Z'), body('M3.5 14c3-2 5 2 8.5 0s5.5-2 8.5 0v3.5c-3-2-5 2-8.5 0s-5.5-2-8.5 0Z')], { noAccent: true }),
    icon('steak', 'Steak', ['beef', 'meat', 't-bone', 'grill', 'bbq'], [body('M5 9c1.5-3.5 7-5 11-3.5s5 5.5 3.5 9-6 5-10 4-6-6-4.5-9.5Z'), line(C(14.5, 10.5, 2)), line('M7.5 15c1.5 1.5 4 2.3 6.5 2')], { noAccent: true }),
    icon('drumstick', 'Drumstick', ['chicken leg', 'poultry', 'fried chicken', 'meat', 'thanksgiving'], [body(rotateD(E(9.5, 9.5, 6.3, 4.6), 45, 9.5, 9.5)), line('M13 13l4 4'), body(C(18.8, 16.6, 1.5) + C(16.6, 18.8, 1.5))], { noAccent: true }),
  ],
};
