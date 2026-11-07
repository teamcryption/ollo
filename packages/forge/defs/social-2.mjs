import { L, D, R } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'social',
  icons: [
    icon('rss', 'RSS', ['feed', 'subscribe', 'blog', 'news'], [line('M5 11a8 8 0 0 1 8 8'), line('M5 5a14 14 0 0 1 14 14'), accent(D(5.5, 18.5))]),
    icon('poll', 'Poll', ['vote', 'survey', 'results', 'opinion'], [body(R(4, 4.5, 10, 3.5, 1.2)), body(R(4, 10.25, 16, 3.5, 1.2)), body(R(4, 16, 7, 3.5, 1.2))], { noAccent: true }),
  ],
};
