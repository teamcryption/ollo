import { C, L } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'transport',
  icons: [
    icon('bus-stop', 'Bus Stop', ['stop', 'station', 'public transport', 'shelter', 'transit'], [line(L(17, 9.5, 17, 20.5)), body(C(17, 6.5, 3)), line('M3.5 15h9M5 15v5.5M11 15v5.5')], { noAccent: true }),
  ],
};
