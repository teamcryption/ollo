import { C, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'science',
  icons: [
    icon('galaxy', 'Galaxy', ['spiral', 'space', 'milky way', 'astronomy', 'cosmos', 'stars'], [line('M12 10C7.5 10 4.5 12.5 4.5 16M12 14c4.5 0 7.5-2.5 7.5-6M14 10.3c-1-3-4-5.3-8-5.3M10 13.7c1 3 4 5.3 8 5.3'), body(C(12, 12, 1.8)), accent(D(19.5, 15.5) + D(4.5, 8.5))]),
  ],
};
