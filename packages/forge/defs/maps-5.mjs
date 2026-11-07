import { L, poly } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'maps',
  icons: [
    icon('summit', 'Summit', ['peak', 'mountain top', 'goal', 'climb', 'achievement'], [body(poly([[3, 20.5], [10.5, 8.5], [14, 13], [16, 10.5], [21, 20.5]], 0.6, true)), line(L(10.5, 8.5, 10.5, 3.5)), body('M10.5 3.5h4l-1 1.25 1 1.25h-4Z')], { noAccent: true }),
  ],
};
