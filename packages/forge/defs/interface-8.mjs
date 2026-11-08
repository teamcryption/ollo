import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, L } from '../src/geo.mjs';

export default {
  category: 'interface',
  icons: [
    icon('popover', 'Popover', ['popup', 'dropdown', 'overlay', 'menu', 'tooltip'], [body('M6 3.5h12a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-4.5L12 14.5l-1.5-2H6a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2Z'), line(R(8, 16.5, 8, 4, 1.5)), accent(L(7.5, 8, 16.5, 8))]),
  ],
};
