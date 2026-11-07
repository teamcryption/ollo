import { R } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'food',
  icons: [
    icon('hotdog', 'Hot Dog', ['sausage', 'frankfurter', 'fast food', 'bbq', 'street food'], [body(R(3.5, 9, 17, 4, 2)), body('M4 13h16a3 3 0 0 1-3 3.5H7A3 3 0 0 1 4 13Z', { cover: true }), line('M7 11l1.5-.8 1.5.8 1.5-.8 1.5.8 1.5-.8 1.5.8 1.5-.8')], { noAccent: true }),
  ],
};
