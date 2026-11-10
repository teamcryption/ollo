import { icon, body, line } from '../src/dsl.mjs';
import { C } from '../src/geo.mjs';

export default {
  category: 'buildings',
  icons: [
    icon('manhole', 'Manhole', ['sewer', 'drain cover', 'utility', 'street', 'maintenance'], [body(C(12, 12, 8.5)), line('M7 8.5h10M5.5 12h13M7 15.5h10')], { noAccent: true }),
  ],
};
