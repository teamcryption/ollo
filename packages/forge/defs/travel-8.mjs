import { icon, body, line } from '../src/dsl.mjs';
import { poly } from '../src/geo.mjs';

export default {
  category: 'travel',
  icons: [
    icon('bucket-spade', 'Bucket and Spade', ['sand bucket', 'pail', 'shovel', 'beach', 'kids'], [line('M4.5 9.5c0-4.5 8-4.5 8 0'), body(poly([[3.5, 9.5], [13.5, 9.5], [12.3, 20.5], [4.7, 20.5]], 1, true)), line('M18 3.5v10'), body(poly([[16, 13.5], [20, 13.5], [20, 17.5], [18, 20.5], [16, 17.5]], 0.6, true))], { noAccent: true }),
  ],
};
