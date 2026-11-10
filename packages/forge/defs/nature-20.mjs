import { icon, body, line } from '../src/dsl.mjs';
import { E } from '../src/geo.mjs';

export default {
  category: 'nature',
  icons: [
    icon('palm-leaf', 'Palm Leaf', ['frond', 'tropical', 'leaf', 'jungle', 'summer'], [line('M4 20.5C8 14 13 8.5 20 4'), line('M8 15.5 6 11.5M10.5 12.5 9.5 8M13.5 9.5 13 5.5M10 15l4 1.5M12.5 12l4.5 1M15.5 9l4 .5')], { noAccent: true }),
    icon('cocoon', 'Cocoon', ['chrysalis', 'metamorphosis', 'pupa', 'butterfly', 'growth'], [line('M6 4h12M12 4v2.5'), body(E(12, 13, 3.5, 6.5)), line('M8.8 10.5c2 1 4.4 1 6.4 0M8.6 14.5c2.2 1 4.6 1 6.8 0')], { noAccent: true }),
  ],
};
