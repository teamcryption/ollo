import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, L } from '../src/geo.mjs';

export default {
  category: 'design',
  icons: [
    icon('quill', 'Quill', ['feather pen', 'writing', 'calligraphy', 'author', 'poetry'], [body('M18.5 3.5C12 4.5 8 9 7 15l2 .5c5-2 9-6 9.5-12Z'), line('M7.5 16 4.5 20.5')], { noAccent: true }),
    icon('inkwell', 'Inkwell', ['ink pot', 'ink', 'calligraphy', 'writing', 'vintage'], [line('M12 9.5 17.5 3.5'), body(R(9, 8.5, 6, 3, 1)), body('M7 12h10l1.5 2.5v5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-5Z'), accent(L(9.5, 17, 14.5, 17))]),
  ],
};
