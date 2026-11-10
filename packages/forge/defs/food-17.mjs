import { icon, body, line, accent } from '../src/dsl.mjs';
import { R } from '../src/geo.mjs';

export default {
  category: 'food',
  icons: [
    icon('hot-chocolate', 'Hot Chocolate', ['cocoa', 'marshmallows', 'warm drink', 'winter', 'mug'], [body('M4.5 9h11v6a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5Z'), line('M15.5 11h1.5a2.5 2.5 0 0 1 0 5h-1.5'), accent(R(6.5, 4, 2.6, 2.2, 0.6) + R(10.5, 4.6, 2.6, 2.2, 0.6))]),
  ],
};
