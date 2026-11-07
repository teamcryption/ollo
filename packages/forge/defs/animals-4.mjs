import { C, E, L } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'animals',
  icons: [
    icon('ladybug', 'Ladybug', ['ladybird', 'beetle', 'insect', 'luck', 'garden bug'], [line('M10 5 8.5 3.5M14 5l1.5-1.5'), body('M8.5 8a3.5 3.5 0 0 1 7 0Z'), body(E(12, 14, 6.5, 6.5), { cover: true }), line(L(12, 7.7, 12, 20.3)), line(C(9, 12.5, 1)), line(C(15, 12.5, 1)), line(C(9, 16.5, 0.9)), line(C(15, 16.5, 0.9))], { noAccent: true, anim: 'wiggle' }),
  ],
};
