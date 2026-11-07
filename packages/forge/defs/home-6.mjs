import { R, L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'home',
  icons: [
    icon('toaster', 'Toaster', ['toast', 'breakfast', 'kitchen appliance', 'bread'], [line('M7.5 9V6.5a1.5 1.5 0 0 1 3 0V9M13.5 9V6.5a1.5 1.5 0 0 1 3 0V9'), body(R(4, 9, 16, 11.5, 3)), accent(L(16.5, 13, 16.5, 16))]),
  ],
};
