import { C } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'food',
  icons: [
    icon('teapot', 'Teapot', ['tea', 'kettle', 'brew', 'afternoon tea', 'pot'], [line('M8.5 10.5h6'), body('M6 11h11v4a4.5 4.5 0 0 1-4.5 4.5h-2A4.5 4.5 0 0 1 6 15Z'), line('M17 13.5l3.5-3'), line('M6 12.5a2.5 2.5 0 0 0 0 5'), accent(C(11.5, 7.5, 1))]),
  ],
};
