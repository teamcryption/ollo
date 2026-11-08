import { R, poly } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'gaming',
  icons: [
    icon('chess-bishop', 'Chess Bishop', ['chess', 'bishop', 'strategy', 'board game', 'diagonal'], [body('M12 4c2.6 2 4 4.4 4 7.2 0 2.2-1.8 3.8-4 3.8s-4-1.6-4-3.8C8 8.4 9.4 6 12 4Z'), line('M13.6 7.5l-2.2 2.8'), body(poly([[9.5, 15], [14.5, 15], [15.5, 18], [8.5, 18]], 0.5, true)), body(R(6, 18, 12, 2.5, 1))], { noAccent: true }),
  ],
};
