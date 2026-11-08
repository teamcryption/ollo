import { icon, body, line, accent } from '../src/dsl.mjs';
import { C } from '../src/geo.mjs';

export default {
  category: 'finance',
  icons: [
    icon('hand-coins', 'Hand Coins', ['payment', 'pay', 'cash', 'tip', 'donation'], [line('M3.5 14.5h2.5l3.5-1.5h4a1.5 1.5 0 0 1 0 3H11M13.5 16l4.3-2.2a1.5 1.5 0 0 1 1.7 2.4L15 19.5H3.5'), body(C(15, 7.5, 3.5)), accent(C(7.5, 8.5, 2))]),
  ],
};
