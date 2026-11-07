import { C } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'business',
  icons: [
    icon('milestone', 'Milestone', ['progress', 'goal', 'roadmap', 'achievement', 'phase'], [line('M3.5 16h1.9M8.6 16h1.8M13.6 16h3.4'), body(C(7, 16, 1.6)), body(C(12, 16, 1.6)), line('M17 16V5'), body('M17 5h3.5l-1 2 1 2H17Z')], { noAccent: true }),
  ],
};
