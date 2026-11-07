import { R, L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'communication',
  icons: [
    icon('postcard', 'Postcard', ['card', 'greetings', 'post', 'travel mail', 'stamp'], [body(R(3.5, 5.5, 17, 13, 2)), line(L(12, 8.5, 12, 15.5)), line(L(6, 9.5, 9.5, 9.5)), line(L(6, 12.5, 9.5, 12.5)), accent(R(14.5, 8.5, 3, 3.5, 0.5))]),
  ],
};
