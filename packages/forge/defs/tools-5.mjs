import { poly } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'tools',
  icons: [
    icon('bucket', 'Bucket', ['pail', 'cleaning', 'water', 'mop bucket', 'container'], [line('M5.5 9a6.5 5.5 0 0 1 13 0'), body(poly([[5, 9], [19, 9], [17.5, 20.5], [6.5, 20.5]], 0.8, true)), line('M5.5 12.5h13')], { noAccent: true }),
  ],
};
