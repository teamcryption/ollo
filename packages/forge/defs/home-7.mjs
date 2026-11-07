import { R } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'home',
  icons: [
    icon('pillow', 'Pillow', ['cushion', 'sleep', 'bed', 'rest', 'bedding'], [body(R(4, 7, 16, 10, 4)), line('M3.5 6.5 5.3 8.3M20.5 6.5l-1.8 1.8M3.5 17.5l1.8-1.8M20.5 17.5l-1.8-1.8')], { noAccent: true }),
  ],
};
