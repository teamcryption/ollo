import { icon, line } from '../src/dsl.mjs';
import { C } from '../src/geo.mjs';

export default {
  category: 'gaming',
  icons: [
    icon('tic-tac-toe', 'Tic-tac-toe', ['noughts and crosses', 'xo', 'grid game', 'puzzle', 'board game'], [line('M9 4v16M15 4v16M4 9h16M4 15h16'), line(C(6.5, 6.5, 1.3)), line('M10.8 10.8l2.4 2.4M13.2 10.8l-2.4 2.4'), line(C(17.5, 17.5, 1.3))], { noAccent: true }),
  ],
};
