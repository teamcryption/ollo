import { icon, body, line } from '../src/dsl.mjs';
import { R, C, poly } from '../src/geo.mjs';

export default {
  category: 'nature',
  icons: [
    icon('scarecrow', 'Scarecrow', ['farm', 'field', 'crops', 'autumn', 'harvest'], [line('M3.5 12.5h5.2M15.3 12.5h5.2M12 17v3.5'), body(poly([[8.5, 11], [15.5, 11], [14.5, 17], [9.5, 17]], 0.8, true)), body(C(12, 8, 2.5)), line('M8 5.5h8'), body(R(10, 3, 4, 2.5, 0.6))], { noAccent: true }),
  ],
};
