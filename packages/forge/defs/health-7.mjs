import { R, L } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'health',
  icons: [
    icon('razor', 'Razor', ['shave', 'shaving', 'grooming', 'blade', 'barber'], [body(R(4.5, 4.5, 15, 4, 1.5)), line(L(12, 8.5, 12, 10.5)), body(R(10.8, 10.5, 2.4, 10, 1.2))], { noAccent: true }),
    icon('shampoo', 'Shampoo', ['pump bottle', 'lotion', 'soap dispenser', 'hygiene', 'bathroom'], [line('M12 7V4.5h4'), body(R(10, 7, 4, 3, 0.5)), body(R(6.5, 10, 11, 10.5, 2.5)), line('M9.5 15h5')], { noAccent: true }),
  ],
};
