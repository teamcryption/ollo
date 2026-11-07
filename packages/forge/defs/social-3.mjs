import { R } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'social',
  icons: [
    icon('poll', 'Poll', ['vote', 'survey', 'question', 'options', 'results'], [body(R(3.5, 4, 17, 16, 2.5)), line(R(7, 7, 10, 2, 1)), accent(R(7, 11, 5.5, 2, 1)), line(R(7, 15, 7.5, 2, 1))]),
  ],
};
