import { icon, body, line } from '../src/dsl.mjs';
import { R } from '../src/geo.mjs';

export default {
  category: 'home',
  icons: [
    icon('coat-hook', 'Coat Hooks', ['wall hooks', 'hanger rail', 'hallway', 'coat rack', 'entryway'], [body(R(3.5, 5, 17, 3.5, 1.5)), line('M7 8.5V15a1.75 1.75 0 0 0 3.5 0M15 8.5V15a1.75 1.75 0 0 0 3.5 0')], { noAccent: true }),
  ],
};
