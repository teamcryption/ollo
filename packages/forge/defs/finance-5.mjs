import { R } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'finance',
  icons: [
    icon('donate', 'Donate', ['charity', 'give', 'donation', 'kindness', 'support'], [body(R(3, 14, 3, 6.5, 1)), line('M6 15h3.5l3 1.5h3a1.4 1.4 0 0 1 0 2.8H10M6 19.5h8.5l5.3-3.1a1.5 1.5 0 0 0-1.5-2.6L15.5 15'), accent('M14 11.5c-2.6-1.7-4-3.1-4-4.6a2 2 0 0 1 4-.8 2 2 0 0 1 4 .8c0 1.5-1.4 2.9-4 4.6Z')], { anim: 'pulse' }),
  ],
};
