import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, L } from '../src/geo.mjs';

export default {
  category: 'home',
  icons: [
    icon('ironing-board', 'Ironing Board', ['ironing', 'laundry', 'clothes', 'pressing', 'chores'], [body('M3.5 8.5h13c2.5 0 4 .9 4 2s-1.5 2-4 2h-13Z'), line('M7 12.5l8 8M15 12.5l-8 8')], { noAccent: true }),
    icon('toothpaste', 'Toothpaste', ['tube', 'dental', 'teeth', 'bathroom', 'hygiene'], [line('M3.5 7.5v9'), body('M5.5 8h10l2.5 2.5v3L15.5 16h-10Z'), body(R(18, 10.5, 2.5, 3, 0.6)), accent(L(8.5, 12, 12.5, 12))]),
    icon('yarn-ball', 'Yarn Ball', ['wool', 'knitting', 'crochet', 'craft', 'thread'], [body(C(11, 11, 7.5)), line('M4.5 8c3.5 0 8 3.5 9.5 10M8 4.2c3.5 1 8 5.5 9.5 10M3.8 12.5c3 .5 5.5 3 6.3 6.3'), line('M16 16.5c1.5 2.5 3 3.5 5 4')], { noAccent: true }),
  ],
};
