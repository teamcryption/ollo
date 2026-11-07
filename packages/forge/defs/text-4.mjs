import { R, L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'text',
  icons: [
    icon('drop-cap', 'Drop Cap', ['initial', 'first letter', 'typography', 'paragraph', 'editorial'], [body(R(3.5, 4, 7, 7, 1.5)), line(L(13.5, 5.5, 20.5, 5.5)), line(L(13.5, 9.5, 20.5, 9.5)), line(L(3.5, 14.5, 20.5, 14.5)), accent(L(3.5, 18.5, 13, 18.5))]),
  ],
};
