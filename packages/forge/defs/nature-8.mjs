import { C, L, poly, star, mirrorD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const SIDE = 'M11 14.5c-2.5-.5-4.5-2.5-5-5.5 2.5.3 4.5 2.3 5 5.5Z';

export default {
  category: 'nature',
  icons: [
    icon('sunflower', 'Sunflower', ['flower', 'summer', 'bloom', 'garden', 'seeds'], [line(L(12, 15, 12, 20.5)), body('M12 18.5c1-2.2 3-3.3 5.5-3.3-.8 2.3-2.8 3.5-5.5 3.3Z'), body(star(12, 9, 6, 3.8, 12, 0.6, -90)), line(C(12, 9, 2.3))], { noAccent: true }),
    icon('succulent', 'Succulent', ['plant', 'cactus', 'houseplant', 'pot', 'echeveria'], [body('M12 14.5c-1.5-2-1.5-5 0-7.5 1.5 2.5 1.5 5.5 0 7.5Z'), body(SIDE), body(mirrorD(SIDE)), body(poly([[6.5, 14.5], [17.5, 14.5], [16.3, 20.5], [7.7, 20.5]], 0.8, true))], { noAccent: true }),
    icon('cave', 'Cave', ['cavern', 'grotto', 'mountain', 'explore', 'adventure'], [body(poly([[3, 20.5], [8, 7.5], [11, 10], [14.5, 5], [21, 20.5]], 1, true)), line('M8.5 20.5V17a3.5 3.5 0 0 1 7 0v3.5')], { noAccent: true }),
    icon('desert', 'Desert', ['dunes', 'sand', 'cactus', 'arid', 'sahara'], [line('M3.5 20.5c3-3 6-4 9-4s5.5 1 8 3'), line('M9 16.6V9.5a1.2 1.2 0 0 1 2.4 0v6.6M11.4 12.5h1.1a1 1 0 0 0 1-1V10M9 13.5H7.9a1 1 0 0 1-1-1V11'), accent(C(17.5, 6.5, 2))]),
  ],
};
