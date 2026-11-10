import { icon, body, line } from '../src/dsl.mjs';
import { R } from '../src/geo.mjs';

export default {
  category: 'business',
  icons: [
    icon('bulletin-board', 'Bulletin Board', ['corkboard', 'notice board', 'pinboard', 'announcements', 'office'], [body(R(3, 4, 18, 14, 1.5)), line(R(5.5, 6.5, 5, 5, 0.5)), line(R(13, 8, 5.5, 7, 0.5)), line('M7 18v2.5M17 18v2.5')], { noAccent: true }),
  ],
};
