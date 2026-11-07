import { C } from '../src/geo.mjs';
import { icon, body, accent } from '../src/dsl.mjs';

export default {
  category: 'food',
  icons: [
    icon('avocado', 'Avocado', ['guacamole', 'fruit', 'healthy', 'vegan', 'toast'], [body('M12 3.5c3 0 4.5 3.5 5.5 7.5a6 6 0 1 1-11 0C7.5 7 9 3.5 12 3.5Z'), accent(C(12, 14, 2.8))]),
  ],
};
