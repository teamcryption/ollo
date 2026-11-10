import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, star } from '../src/geo.mjs';

const flames = [5, 8.5, 12, 15.5, 19].map((x) => `M${x} 4c.9 1 1.3 1.7 1.3 2.3a1.3 1.3 0 0 1-2.6 0c0-.6.4-1.3 1.3-2.3Z`).join('');

export default {
  category: 'celebration',
  icons: [
    icon('candy-cane', 'Candy Cane', ['christmas', 'peppermint', 'sweet', 'holiday', 'xmas'], [body('M15.5 20.5V8a4.5 4.5 0 0 0-9 0v1.5h3V8a1.5 1.5 0 0 1 3 0v12.5Z'), line('M12.6 13.5l2.8-1.5M12.6 17.5l2.8-1.5')], { noAccent: true }),
    icon('gingerbread', 'Gingerbread Man', ['cookie', 'christmas', 'baking', 'holiday', 'biscuit'], [body(C(12, 6, 2.6)), body('M9.5 9.5h5l4 2.5-1 2-3-1.5v3l2.5 4.5-2 1-2-3.5-2 3.5-2-1 2.5-4.5v-3l-3 1.5-1-2Z', { cover: true }), line(D(12, 12.5) + D(12, 15))], { noAccent: true }),
    icon('bauble', 'Bauble', ['ornament', 'christmas', 'tree decoration', 'xmas', 'holiday'], [body(R(10, 4, 4, 2.5, 0.6)), body(C(12, 13.5, 7)), accent('M8 11.5a4.5 4.5 0 0 1 3-3')]),
    icon('witch-hat', 'Witch Hat', ['halloween', 'witch', 'magic', 'costume', 'spooky'], [body('M8.5 15 11.5 5c.3-1.2 1.8-1.7 2.8-.8L17 7l-2.5.5L16 15Z'), line('M9.2 12.5h6.2'), body(E(12, 16.5, 8.5, 2.5), { cover: true })], { noAccent: true }),
    icon('cauldron', 'Cauldron', ['halloween', 'potion', 'witch', 'brew', 'magic'], [line('M3.5 10h17M7.5 19 6.5 20.5M16.5 19l1 1.5'), body('M5 10h14v2.5a7 7 0 0 1-14 0Z'), accent(C(9, 6, 1.3) + C(13, 5, 1) + C(15.8, 7.2, 0.8))]),
    icon('santa-hat', 'Santa Hat', ['christmas', 'santa claus', 'xmas', 'holiday', 'festive'], [body('M4.5 16c1-6 4-10.5 9-10.5 3 0 5 2 5.5 5l-2.5-.5c-.5-1.5-1.5-2.5-3-2.5-2.5 0-4.5 3-5 8.5Z'), body(C(18.5, 13, 1.8)), body(R(3.5, 15.5, 13, 4, 2), { cover: true })], { noAccent: true }),
    icon('sleigh', 'Sleigh', ['santa', 'sled', 'christmas', 'snow', 'reindeer'], [body('M4 7h3l1.5 4.5h8a2 2 0 0 1 2 2V15.5H5.5Z'), line('M7.5 15.5v3M15.5 15.5v3M3.5 18.5h14a3 3 0 0 0 3-3')], { noAccent: true }),
    icon('firecracker', 'Firecracker', ['fireworks', 'new year', 'diwali', 'celebration', 'cracker'], [body(R(9, 9.5, 6, 11, 1.5)), line('M12 9.5V8.5c0-1 .4-1.6 1-2'), accent(star(17.5, 5.3, 2.2, 0.9, 4, 0.3))]),
    icon('red-envelope', 'Red Envelope', ['hongbao', 'lunar new year', 'gift money', 'lucky money', 'festival'], [body(R(6, 3.5, 12, 17, 2)), line('M6.2 8.5c3.5 2 8.1 2 11.6 0'), accent(C(12, 14.5, 2))]),
    icon('diya', 'Diya', ['oil lamp', 'diwali', 'festival of lights', 'deepavali', 'lamp'], [body('M3.5 14.5c1 3.5 4.5 5.5 8.5 5.5s7.5-2 8.5-5.5Z'), accent('M12 4c2 2.2 3 3.8 3 5.2a3 3 0 0 1-6 0c0-1.4 1-3 3-5.2Z')]),
  ],
};
