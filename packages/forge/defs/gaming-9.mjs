import { R, D } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'gaming',
  icons: [
    icon('chess-knight', 'Chess Knight', ['chess', 'knight', 'horse', 'strategy', 'board game'], [body('M8 18c0-4 1-6.5 3-8.5L8.5 9.2 8 7l3.5-2.5 1.5-1 1 1.5c2.5 1 4 4 4 7.5V18Z'), line(D(12.5, 7.3)), body(R(6, 18, 12, 2.5, 1))], { noAccent: true }),
  ],
};
