import { L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'weather',
  icons: [
    icon('thermometer-snow', 'Cold', ['freezing', 'frost', 'temperature', 'winter', 'chill'], [body('M5.5 5a2 2 0 0 1 4 0v8.1a4 4 0 1 1-4 0Z'), accent(L(7.5, 14, 7.5, 16)), line('M16 5v7M13 6.75l6 3.5M13 10.25l6-3.5')]),
  ],
};
