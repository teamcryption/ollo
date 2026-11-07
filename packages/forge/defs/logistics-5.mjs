import { R, C } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'logistics',
  icons: [
    icon('pallet-jack', 'Pallet Jack', ['pallet truck', 'hand pallet', 'warehouse', 'lifting', 'forks'], [body(R(3.5, 15, 13, 2.5, 1)), body(C(5.5, 19.5, 1.2)), body(C(14.5, 19.5, 1.2)), line('M16.5 16 19.5 5.5'), line('M18 5h3')], { noAccent: true }),
  ],
};
