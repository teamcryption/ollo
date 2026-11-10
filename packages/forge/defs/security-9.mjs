import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, star } from '../src/geo.mjs';

export default {
  category: 'security',
  icons: [
    icon('fire-hydrant', 'Fire Hydrant', ['hydrant', 'firefighter', 'water', 'street', 'fire safety'], [body('M8 7.5a4 4 0 0 1 8 0Z'), body(R(8, 7.5, 8, 10.5, 1)), line('M5.5 11h2.5M16 11h2.5'), body(R(6.5, 18, 11, 2.5, 1)), accent(C(12, 12.5, 1.4))]),
    icon('police-badge', 'Police Badge', ['sheriff', 'law enforcement', 'officer', 'star badge', 'police'], [body(star(12, 12, 8.5, 5, 6, 0.8)), accent(C(12, 12, 1.8))]),
  ],
};
