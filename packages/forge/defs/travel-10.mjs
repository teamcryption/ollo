import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, L } from '../src/geo.mjs';

export default {
  category: 'travel',
  icons: [
    icon('oxygen-tank', 'Oxygen Tank', ['scuba tank', 'air cylinder', 'diving', 'gas', 'medical oxygen'], [body(R(10.5, 3.5, 3, 3, 0.6)), line('M13.5 5h2.5'), body(R(7, 6.5, 10, 14, 4)), accent(L(10, 12, 14, 12))]),
  ],
};
