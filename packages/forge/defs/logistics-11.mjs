import { icon, body, line } from '../src/dsl.mjs';
import { R, C } from '../src/geo.mjs';

export default {
  category: 'logistics',
  icons: [
    icon('conveyor-belt', 'Conveyor Belt', ['assembly line', 'factory', 'warehouse', 'production', 'sorting'], [body(R(4.5, 5.5, 6, 6, 1) + R(13, 7.5, 5, 4, 1)), line(R(3, 13.5, 18, 6, 3)), line(C(6, 16.5, 1) + C(12, 16.5, 1) + C(18, 16.5, 1))], { noAccent: true }),
  ],
};
