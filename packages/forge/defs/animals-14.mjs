import { icon, body, line } from '../src/dsl.mjs';
import { D } from '../src/geo.mjs';

export default {
  category: 'animals',
  icons: [
    icon('bull', 'Bull', ['bullish', 'ox', 'cattle', 'stock market', 'rodeo'], [line('M8 9C5 9 4 7 4 4.5M16 9c3 0 4-2 4-4.5'), body('M8 9h8l-1 8a3 3 0 0 1-6 0Z'), line(D(10.6, 17) + D(13.4, 17) + D(10.5, 11.5) + D(13.5, 11.5))], { noAccent: true }),
  ],
};
