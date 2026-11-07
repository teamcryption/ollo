import { C, poly } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'tools',
  icons: [
    icon('wheelbarrow', 'Wheelbarrow', ['garden', 'construction', 'barrow', 'haul', 'landscaping'], [body(poly([[3.5, 8.5], [16.5, 8.5], [14, 14.5], [6, 14.5]], 0.6, true)), line('M16.5 8.5l4-2'), line('M7 14.5 6 18.5'), body(C(15, 18.2, 2.2))], { noAccent: true }),
  ],
};
