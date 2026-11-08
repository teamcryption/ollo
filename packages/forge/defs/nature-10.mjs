import { poly } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'nature',
  icons: [
    icon('silo', 'Silo', ['farm', 'grain', 'barn', 'agriculture', 'storage'], [body('M13 20.5V8a3.5 3.5 0 0 1 7 0v12.5Z'), line('M13 12h7M13 16h7'), body(poly([[3.5, 20.5], [3.5, 13], [7.5, 10], [11.5, 13], [11.5, 20.5]], 0.6, true)), line('M6 20.5V17h3v3.5')], { noAccent: true }),
  ],
};
