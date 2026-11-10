import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, L } from '../src/geo.mjs';

export default {
  category: 'transport',
  icons: [
    icon('road-barrier', 'Road Barrier', ['roadblock', 'barricade', 'construction', 'closed road', 'detour'], [body(R(3.5, 8, 17, 5, 1)), line('M7.5 8 6 13M12.5 8 11 13M17.5 8 16 13'), line('M6 13v7.5M18 13v7.5M4 20.5h4M16 20.5h4'), accent(C(12, 4.6, 1.1))]),
    icon('license-plate', 'License Plate', ['number plate', 'registration', 'car', 'vehicle', 'tag'], [body(R(3, 7, 18, 10, 2)), line(D(6, 9.6) + D(18, 9.6)), accent(L(7.5, 13, 16.5, 13))]),
    icon('car-key', 'Car Key', ['key fob', 'remote key', 'unlock car', 'vehicle', 'keyless'], [body(R(3.5, 5, 8, 11, 3)), accent(D(7.5, 8.5)), line(D(7.5, 12.5)), body('M11.5 9h7.5l1.5 1.5-1.5 1.5h-1l-1 1-1-1h-4.5Z')]),
    icon('headlight', 'Headlight', ['headlamp', 'high beam', 'car light', 'dashboard', 'lights'], [body('M4.5 12c0-3.5 2.5-5.5 6-5.5h1v11h-1c-3.5 0-6-2-6-5.5Z'), line('M14.5 8h6M14.5 12h6M14.5 16h6')], { noAccent: true }),
  ],
};
