import { icon, body, line } from '../src/dsl.mjs';
import { R, C, D, poly } from '../src/geo.mjs';

export default {
  category: 'fashion',
  icons: [
    icon('yarn', 'Yarn', ['wool', 'knitting', 'ball of yarn', 'crochet', 'craft'], [body(C(12, 11.5, 7.5)), line('M6 8c3 0 7 2 10 7M8 5.5c3.5.5 8 4 9.5 9M5 12.5c3 .5 6 3 7.5 6.5'), line('M15.8 18c1.5 1.7 3 2.5 5 2.5')], { noAccent: true }),
  ],
};
