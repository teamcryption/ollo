import { icon, body, line, accent } from '../src/dsl.mjs';
import { L } from '../src/geo.mjs';

export default {
  category: 'fashion',
  icons: [
    icon('glove', 'Glove', ['gloves', 'hand', 'winter', 'gardening', 'protection'], [body('M7.5 20.5V13l-2-2.3a1.3 1.3 0 0 1 2-1.7L9 10.5V5.2a1.2 1.2 0 0 1 2.4 0V10V4.2a1.2 1.2 0 0 1 2.4 0V10V5.2a1.2 1.2 0 0 1 2.4 0V10.5V7.5a1.2 1.2 0 0 1 2.4 0v6.5c0 2.6-1.4 4.8-3.3 6.5Z'), line(L(7.7, 17.5, 16.7, 17.5))], { noAccent: true }),
    icon('jacket', 'Jacket', ['coat', 'blazer', 'outerwear', 'clothing', 'winter'], [body('M8.5 4 4 6.5v14h6.5V9L12 7l1.5 2v11.5H20v-14L15.5 4 12 7Z'), accent(L(6.3, 15, 8.3, 15))]),
  ],
};
