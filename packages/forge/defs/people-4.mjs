import { C, L } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'people',
  icons: [
    icon('elderly', 'Elderly Person', ['senior', 'old age', 'pensioner', 'cane', 'aged care'], [body(C(10, 5, 1.8)), line('M10 8.5c-1.5 2-2 4-1.5 6l1 6'), line('M9.5 10.5 15 12'), line('M9 14.5 6.5 20.5'), line('M15 20.5V12c0-1 .7-1.5 1.5-1.5')], { noAccent: true }),
  ],
};
