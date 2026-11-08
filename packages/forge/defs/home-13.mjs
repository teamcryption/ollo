import { R } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'home',
  icons: [
    icon('gate', 'Gate', ['entrance', 'garden gate', 'yard', 'entry', 'fence'], [line('M6 9c2.5-1.5 9.5-1.5 12 0M6 18h12M9 8.2V18M12 7.9V18M15 8.2V18'), body(R(3.5, 4.5, 2.5, 16, 1)), body(R(18, 4.5, 2.5, 16, 1))], { noAccent: true }),
  ],
};
