import { R, C, poly } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'fashion',
  icons: [
    icon('comb', 'Comb', ['hair', 'grooming', 'barber', 'style', 'beauty'], [body(R(3, 6.5, 18, 4, 1.5)), line([5, 7, 9, 11, 13, 15, 17, 19].map((x) => `M${x} 10.5v7`).join(''))], { noAccent: true }),
    icon('hairdryer', 'Hair Dryer', ['blow dryer', 'hair', 'salon', 'beauty', 'styling'], [body(R(6, 12.5, 4, 8, 1.5)), body(R(3, 5, 12.5, 8, 4), { cover: true }), body(poly([[15.5, 6.5], [20.5, 5.5], [20.5, 12.5], [15.5, 11.5]], 0.5, true)), line(C(7, 9, 1.6))], { noAccent: true }),
  ],
};
