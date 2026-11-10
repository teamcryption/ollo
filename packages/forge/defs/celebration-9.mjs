import { icon, body, line } from '../src/dsl.mjs';
import { R } from '../src/geo.mjs';


export default {
  category: 'celebration',
  icons: [
    icon('wedding-cake', 'Wedding Cake', ['tiered cake', 'wedding', 'celebration', 'dessert', 'bakery'], [body(R(4, 15.5, 16, 5, 1)), body(R(6.5, 10.5, 11, 5, 1), { cover: true }), body(R(9, 6, 6, 4.5, 1), { cover: true }), line('M12 6V3.5')], { noAccent: true }),
  ],
};
