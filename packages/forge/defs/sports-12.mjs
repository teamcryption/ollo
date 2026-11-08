import { L, poly } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'sports',
  icons: [
    icon('bow-arrow', 'Bow and Arrow', ['archery', 'bow', 'arrow', 'target', 'hunting'], [line('M6.5 4.5C13 4.5 19.5 11 19.5 17.5'), line('M6.5 4.5 19.5 17.5'), line(L(4, 20, 16, 8)), body(poly([[18.5, 5.5], [14.3, 7.1], [16.9, 9.7]], 0.4, true))], { noAccent: true }),
  ],
};
